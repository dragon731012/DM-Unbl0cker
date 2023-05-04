import http from 'node:http';
import https from 'node:https';
import { Response, Headers } from './AbstractMessage.js';
import { mapHeadersFromArray, rawHeaderNames } from './headerUtil.js';
import { decodeProtocol } from './encodeProtocol.js';
import { randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

const valid_protocols = ['http:', 'https:', 'ws:', 'wss:'];

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
		outgoing.on('response', () => {
			reject('Remote upgraded the WebSocket');
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

function read_headers(server_request) {
	const remote = Object.setPrototypeOf({}, null);
	const headers = Object.setPrototypeOf({}, null);

	for (let remote_prop of ['host', 'port', 'protocol', 'path']) {
		const header = `x-bare-${remote_prop}`;

		if (server_request.headers.has(header)) {
			let value = server_request.headers.get(header);

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

	if (server_request.headers.has('x-bare-headers')) {
		let json;

		try {
			json = JSON.parse(server_request.headers.get('x-bare-headers'));

			for (let header in json) {
				if (typeof json[header] !== 'string' && !Array.isArray(json[header])) {
					return {
						error: {
							code: 'INVALID_BARE_HEADER',
							id: `bare.headers.${header}`,
							message: `Header was not a String or Array.`,
						},
					};
				}
			}
		} catch (err) {
			return {
				error: {
					code: 'INVALID_BARE_HEADER',
					id: `request.headers.${header}`,
					message: `Header contained invalid JSON. (${err.message})`,
				},
			};
		}

		Object.assign(headers, json);
	} else {
		return {
			error: {
				code: 'MISSING_BARE_HEADER',
				id: `request.headers.x-bare-headers`,
				message: `Header was not specified.`,
			},
		};
	}

	if (server_request.headers.has('x-bare-forward-headers')) {
		let json;

		try {
			json = JSON.parse(server_request.headers.get('x-bare-forward-headers'));
		} catch (err) {
			return {
				error: {
					code: 'INVALID_BARE_HEADER',
					id: `request.headers.x-bare-forward-headers`,
					message: `Header contained invalid JSON. (${err.message})`,
				},
			};
		}

		load_forwarded_headers(json, headers, server_request);
	} else {
		return {
			error: {
				code: 'MISSING_BARE_HEADER',
				id: `request.headers.x-bare-forward-headers`,
				message: `Header was not specified.`,
			},
		};
	}

	return { remote, headers };
}

async function v1(server, server_request) {
	const { error, remote, headers } = read_headers(server_request);

	if (error) {
		// sent by browser, not client
		if (server_request.method === 'OPTIONS') {
			return new Response(undefined, 200);
		} else {
			return server.json(400, error);
		}
	}

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

	for (let header in response.headers) {
		if (header === 'content-encoding' || header === 'x-content-encoding') {
			response_headers.set('content-encoding', response.headers[header]);
		} else if (header === 'content-length') {
			response_headers.set('content-length', response.headers[header]);
		}
	}

	response_headers.set(
		'x-bare-headers',
		JSON.stringify(
			mapHeadersFromArray(rawHeaderNames(response.rawHeaders), {
				...response.headers,
			})
		)
	);
	response_headers.set('x-bare-status', response.statusCode);
	response_headers.set('x-bare-status-text', response.statusMessage);

	return new Response(response, 200, response_headers);
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

async function v1wsmeta(server, server_request) {
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

	const { meta } = temp_meta[id];

	if (typeof meta === 'undefined') {
		return server.json(200, null);
	}

	delete temp_meta[id];

	return server.json(200, meta);
}

async function v1wsnewmeta(server, server_request) {
	const id = (await randomBytesAsync(32)).toString('hex');

	temp_meta[id] = {
		expires: Date.now() + 30e3,
	};

	return new Response(Buffer.from(id.toString('hex')));
}

async function v1socket(server, server_request, server_socket, server_head) {
	if (!server_request.headers.has('sec-websocket-protocol')) {
		server_socket.end();
		return;
	}

	const [first_protocol, data] = server_request.headers
		.get('sec-websocket-protocol')
		.split(/,\s*/g);

	if (first_protocol !== 'bare') {
		server_socket.end();
		return;
	}

	const { remote, headers, forward_headers, id } = JSON.parse(
		decodeProtocol(data)
	);

	load_forwarded_headers(forward_headers, headers, server_request);

	const [response, socket, head] = await upgradeFetch(
		server,
		server_request,
		headers,
		remote
	);

	if (id in temp_meta) {
		const meta = {
			headers: mapHeadersFromArray(rawHeaderNames(response.rawHeaders), {
				...response.headers,
			}),
		};

		temp_meta[id].meta = meta;
	}

	const response_headers = [
		`HTTP/1.1 101 Switching Protocols`,
		`Upgrade: websocket`,
		`Connection: Upgrade`,
		`Sec-WebSocket-Protocol: bare`,
		`Sec-WebSocket-Accept: ${response.headers['sec-websocket-accept']}`,
	];

	if ('sec-websocket-extensions' in response.headers) {
		response_headers.push(
			`Sec-WebSocket-Extensions: ${response.headers['sec-websocket-extensions']}`
		);
	}

	server_socket.write(response_headers.concat('', '').join('\r\n'));
	server_socket.write(head);

	socket.on('close', () => {
		// console.log('Remote closed');
		server_socket.end();
	});

	server_socket.on('close', () => {
		// console.log('Serving closed');
		socket.end();
	});

	socket.on('error', err => {
		server.error('Remote socket error:', err);
		server_socket.end();
	});

	server_socket.on('error', err => {
		server.error('Serving socket error:', err);
		socket.end();
	});

	socket.pipe(server_socket);
	server_socket.pipe(socket);
}

export default function register(server) {
	server.routes.set('/v1/', v1);
	server.routes.set('/v1/ws-new-meta', v1wsnewmeta);
	server.routes.set('/v1/ws-meta', v1wsmeta);
	server.socket_routes.set('/v1/', v1socket);
}
