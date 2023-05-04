import http from 'node:http';
import https from 'node:https';
import { Response, Headers } from './AbstractMessage.js';
import { split_headers, join_headers } from './splitHeaderUtil.js';
import { mapHeadersFromArray, rawHeaderNames } from './headerUtil.js';
import { decodeProtocol } from './encodeProtocol.js';
import { randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

const valid_protocols = ['http:', 'https:', 'ws:', 'wss:'];

const forbidden_forward = [
	'connection',
	'transfer-encoding',
	'host',
	'connection',
	'origin',
	'referer',
];
const forbidden_pass = [
	'vary',
	'connection',
	'transfer-encoding',
	'access-control-allow-headers',
	'access-control-allow-methods',
	'access-control-expose-headers',
	'access-control-max-age',
	'access-cntrol-request-headers',
	'access-control-request-method',
];

// common defaults
const default_forward_headers = [
	'accept-encoding',
	'accept-language',
	'sec-websocket-extensions',
	'sec-websocket-key',
	'sec-websocket-version',
];
const default_pass_headers = [
	'content-encoding',
	'content-length',
	'last-modified',
];
const default_pass_status = [];

// defaults if the client provides a cache key
const default_cache_forward_headers = [
	'if-modified-since',
	'if-none-match',
	'cache-control',
];
const default_cache_pass_headers = ['cache-control', 'etag'];
const default_cache_pass_status = [304];

// vary isnt respected
// const vary_headers = ['x-bare-protocol', 'x-bare-host', 'x-bare-port', 'x-bare-path', 'x-bare-headers'];

const randomBytesAsync = promisify(randomBytes);

// max of 4 concurrent sockets, rest is queued while busy? set max to 75

const http_agent = http.Agent({
	keepAlive: true,
});

const https_agent = https.Agent({
	keepAlive: true,
});

async function fetch(server, server_request, request_headers, url) {
	const options = {
		host: url.host,
		port: url.port,
		path: url.path,
		method: server_request.method,
		headers: request_headers,
		setHost: false,
		localAddress: server.local_address,
	};

	let outgoing;

	if (url.protocol === 'https:') {
		outgoing = https.request({ ...options, agent: https_agent });
	} else if (url.protocol === 'http:') {
		outgoing = http.request({ ...options, agent: http_agent });
	} else {
		throw new RangeError(`Unsupported protocol: '${url.protocol}'`);
	}

	server_request.body.pipe(outgoing);

	return await new Promise((resolve, reject) => {
		outgoing.on('response', resolve);
		outgoing.on('error', reject);
	});
}

async function upgradeFetch(server, server_request, request_headers, url) {
	const options = {
		host: url.host,
		port: url.port,
		path: url.path,
		headers: request_headers,
		method: server_request.method,
		setHost: false,
		localAddress: server.local_address,
	};

	let outgoing;

	if (url.protocol === 'wss:') {
		outgoing = https.request({ ...options, agent: https_agent });
	} else if (url.protocol === 'ws:') {
		outgoing = http.request({ ...options, agent: http_agent });
	} else {
		throw new RangeError(`Unsupported protocol: '${url.protocol}'`);
	}

	outgoing.end();

	return await new Promise((resolve, reject) => {
		outgoing.on('response', response => {
			reject("Remote didn't upgrade the WebSocket");
		});

		outgoing.on('upgrade', (...args) => {
			resolve(args);
		});

		outgoing.on('error', error => {
			reject(error);
		});
	});
}

function load_forwarded_headers(forward, target, client_request) {
	for (let header of forward) {
		if (client_request.headers.has(header)) {
			target[header] = client_request.headers.get(header);
		}
	}
}

const split_header_value = /,\s*/g;

/**
 *
 * @param {import('./AbstractMessage.js').Request} server_request
 * @returns
 */
function read_headers(server_request) {
	const remote = Object.setPrototypeOf({}, null);
	const send_headers = Object.setPrototypeOf({}, null);
	const pass_headers = [...default_pass_headers];
	const pass_status = [...default_pass_status];
	const forward_headers = [...default_forward_headers];

	// should be unique
	const cache = server_request.url.searchParams.has('cache');

	if (cache) {
		pass_headers.push(...default_cache_pass_headers);
		pass_status.push(...default_cache_pass_status);
		forward_headers.push(...default_cache_forward_headers);
	}

	const headers = join_headers(server_request.headers);

	if (headers.error) {
		return {
			error: headers.error,
		};
	}

	for (let remote_prop of ['host', 'port', 'protocol', 'path']) {
		const header = `x-bare-${remote_prop}`;

		if (headers.has(header)) {
			let value = headers.get(header);

			switch (remote_prop) {
				case 'port':
					value = parseInt(value);
					if (isNaN(value)) {
						return {
							error: {
								code: 'INVALID_BARE_HEADER',
								id: `request.headers.${header}`,
								message: `Header was not a valid integer.`,
							},
						};
					}
					break;
				case 'protocol':
					if (!valid_protocols.includes(value)) {
						return {
							error: {
								code: 'INVALID_BARE_HEADER',
								id: `request.headers.${header}`,
								message: `Header was invalid`,
							},
						};
					}
					break;
			}

			remote[remote_prop] = value;
		} else {
			return {
				error: {
					code: 'MISSING_BARE_HEADER',
					id: `request.headers.${header}`,
					message: `Header was not specified.`,
				},
			};
		}
	}

	if (headers.has('x-bare-headers')) {
		let json;

		try {
			json = JSON.parse(headers.get('x-bare-headers'));
		} catch (err) {
			return {
				error: {
					code: 'INVALID_BARE_HEADER',
					id: `request.headers.x-bare-headers`,
					message: `Header contained invalid JSON. (${err.message})`,
				},
			};
		}

		for (let header in json) {
			const value = json[header];

			if (header.toLowerCase() === 'host' && value !== remote.host) {
				return {
					error: {
						code: 'INVALID_BARE_HEADER',
						id: `bare.headers.${header}`,
						message: `Host was not equal to x-bare-host`,
					},
				};
			}

			if (typeof value === 'string') {
				send_headers[header] = value;
			} else if (Array.isArray(value)) {
				const array = [];

				for (let val in value) {
					if (typeof val !== 'string') {
						return {
							error: {
								code: 'INVALID_BARE_HEADER',
								id: `bare.headers.${header}`,
								message: `Header was not a String.`,
							},
						};
					}

					array.push(val);
				}

				send_headers[header] = array;
			} else {
				return {
					error: {
						code: 'INVALID_BARE_HEADER',
						id: `bare.headers.${header}`,
						message: `Header was not a String.`,
					},
				};
			}
		}
	} else {
		return {
			error: {
				code: 'MISSING_BARE_HEADER',
				id: `request.headers.x-bare-headers`,
				message: `Header was not specified.`,
			},
		};
	}

	if (headers.has('x-bare-pass-status')) {
		const parsed = headers.get('x-bare-pass-status').split(split_header_value);

		for (let value of parsed) {
			const number = parseInt(value);

			if (isNaN(number)) {
				return {
					error: {
						code: 'INVALID_BARE_HEADER',
						id: `request.headers.x-bare-pass-status`,
						message: `Array contained non-number value.`,
					},
				};
			} else {
				pass_status.push(number);
			}
		}
	}

	if (headers.has('x-bare-pass-headers')) {
		const parsed = headers.get('x-bare-pass-headers').split(split_header_value);

		for (let header of parsed) {
			header = header.toLowerCase();

			if (forbidden_pass.includes(header)) {
				return {
					error: {
						code: 'FORBIDDEN_BARE_HEADER',
						id: `request.headers.x-bare-forward-headers`,
						message: `A forbidden header was passed.`,
					},
				};
			} else {
				pass_headers.push(header);
			}
		}
	}

	if (headers.has('x-bare-forward-headers')) {
		const parsed = headers
			.get('x-bare-forward-headers')
			.split(split_header_value);

		for (let header of parsed) {
			header = header.toLowerCase();

			if (forbidden_forward.includes(header)) {
				return {
					error: {
						code: 'FORBIDDEN_BARE_HEADER',
						id: `request.headers.x-bare-forward-headers`,
						message: `A forbidden header was forwarded.`,
					},
				};
			} else {
				forward_headers.push(header);
			}
		}
	}

	return {
		remote,
		headers: send_headers,
		pass_headers,
		pass_status,
		forward_headers,
	};
}

async function request(server, server_request) {
	const { error, remote, headers, pass_headers, pass_status, forward_headers } =
		read_headers(server_request);

	if (error) {
		// sent by browser, not client
		if (server_request.method === 'OPTIONS') {
			return new Response(undefined, 200);
		} else {
			return server.json(400, error);
		}
	}

	load_forwarded_headers(forward_headers, headers, server_request);

	let response;

	try {
		response = await fetch(server, server_request, headers, remote);
	} catch (err) {
		if (err instanceof Error) {
			switch (err.code) {
				case 'ENOTFOUND':
					return server.json(500, {
						code: 'HOST_NOT_FOUND',
						id: 'request',
						message: 'The specified host could not be resolved.',
					});
				case 'ECONNREFUSED':
					return server.json(500, {
						code: 'CONNECTION_REFUSED',
						id: 'response',
						message: 'The remote rejected the request.',
					});
				case 'ECONNRESET':
					return server.json(500, {
						code: 'CONNECTION_RESET',
						id: 'response',
						message: 'The request was forcibly closed.',
					});
				case 'ETIMEOUT':
					return server.json(500, {
						code: 'CONNECTION_TIMEOUT',
						id: 'response',
						message: 'The response timed out.',
					});
			}
		}

		throw err;
	}

	const response_headers = new Headers();

	for (let header of pass_headers) {
		if (header in response.headers) {
			response_headers.set(header, response.headers[header]);
		}
	}

	response_headers.set('x-bare-status', response.statusCode);
	response_headers.set('x-bare-status-text', response.statusMessage);
	response_headers.set(
		'x-bare-headers',
		JSON.stringify(
			mapHeadersFromArray(rawHeaderNames(response.rawHeaders), {
				...response.headers,
			})
		)
	);

	let status;

	if (pass_status.includes(response.statusCode)) {
		status = response.statusCode;
	} else {
		status = 200;
	}

	return new Response(response, status, split_headers(response_headers));
}

// prevent users from specifying id=__proto__ or id=constructor
const temp_meta = Object.setPrototypeOf({}, null);

setInterval(() => {
	for (let id in temp_meta) {
		if (temp_meta[id].expires < Date.now()) {
			delete temp_meta[id];
		}
	}
}, 1e3);

/**
 *
 * @param {import('./Server.js').default} server
 * @param {import('./AbstractMessage.js').Request} server_request
 */
async function get_meta(server, server_request) {
	if (server_request.method === 'OPTIONS') {
		return new Response(undefined, 200);
	}

	if (!server_request.headers.has('x-bare-id')) {
		return server.json(400, {
			code: 'MISSING_BARE_HEADER',
			id: 'request.headers.x-bare-id',
			message: 'Header was not specified',
		});
	}

	const id = server_request.headers.get('x-bare-id');

	if (!(id in temp_meta)) {
		return server.json(400, {
			code: 'INVALID_BARE_HEADER',
			id: 'request.headers.x-bare-id',
			message: 'Unregistered ID',
		});
	}

	const meta = temp_meta[id];

	delete temp_meta[id];

	const response_headers = new Headers();

	response_headers.set('x-bare-status', meta.response.status);
	response_headers.set('x-bare-status-text', meta.response.status_text);
	response_headers.set('x-bare-headers', JSON.stringify(meta.response.headers));

	return new Response(undefined, 200, split_headers(response_headers));
}

async function new_meta(server, server_request) {
	const { error, remote, headers, forward_headers } =
		read_headers(server_request);

	if (error) {
		// sent by browser, not client
		if (server_request.method === 'OPTIONS') {
			return new Response(undefined, 200);
		} else {
			return server.json(400, error);
		}
	}

	const id = (await randomBytesAsync(32)).toString('hex');

	temp_meta[id] = {
		expires: Date.now() + 30e3,
		remote,
		headers,
		forward_headers,
		response: {},
	};

	return new Response(Buffer.from(id));
}

async function socket(server, client_request, client_socket, client_head) {
	if (!client_request.headers.has('sec-websocket-protocol')) {
		server_socket.end();
		return;
	}

	const protocol = client_request.headers.get('sec-websocket-protocol');

	const id = decodeProtocol(protocol);

	if (!(id in temp_meta)) {
		server_socket.end();
		return;
	}

	const meta = temp_meta[id];

	load_forwarded_headers(meta.forward_headers, meta.headers, client_request);

	const [remote_response, remote_socket, head] = await upgradeFetch(
		server,
		client_request,
		meta.headers,
		meta.remote
	);
	const remote_headers = new Headers(remote_response.headers);

	meta.response.headers = mapHeadersFromArray(
		rawHeaderNames(remote_response.rawHeaders),
		{ ...remote_response.headers }
	);
	meta.response.status = remote_response.statusCode;
	meta.response.status_text = remote_response.statusMessage;

	const response_headers = [
		`HTTP/1.1 101 Switching Protocols`,
		`Upgrade: websocket`,
		`Connection: Upgrade`,
		`Sec-WebSocket-Protocol: ${protocol}`,
	];

	if (remote_headers.has('sec-websocket-extensions')) {
		response_headers.push(
			`Sec-WebSocket-Extensions: ${remote_headers.get(
				'sec-websocket-extensions'
			)}`
		);
	}

	if (remote_headers.has('sec-websocket-accept')) {
		response_headers.push(
			`Sec-WebSocket-Accept: ${remote_headers.get('sec-websocket-accept')}`
		);
	}

	client_socket.write(response_headers.concat('', '').join('\r\n'));
	client_socket.write(head);

	remote_socket.on('close', () => {
		// console.log('Remote closed');
		client_socket.end();
	});

	client_socket.on('close', () => {
		// console.log('Serving closed');
		remote_socket.end();
	});

	remote_socket.on('error', err => {
		server.error('Remote socket error:', err);
		client_socket.end();
	});

	client_socket.on('error', err => {
		server.error('Serving socket error:', err);
		remote_socket.end();
	});

	remote_socket.pipe(client_socket);
	client_socket.pipe(remote_socket);
}

export default function register(server) {
	server.routes.set('/v2/', request);
	server.routes.set('/v2/ws-new-meta', new_meta);
	server.routes.set('/v2/ws-meta', get_meta);
	server.socket_routes.set('/v2/', socket);
}
