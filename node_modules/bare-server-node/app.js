import { Command, Option } from 'commander';
import server from './cli/server.js';

const program = new Command();

program
	.command('server')
	.addOption(
		new Option('--d, --directory <directory>', 'Bare directory').default('/')
	)
	.addOption(
		new Option('--h, --host <host>', 'Listening host').default('localhost')
	)
	.addOption(
		new Option('--p, --port <port>', 'Listening port').default(80).env('PORT')
	)
	.addOption(new Option('--e, --errors', 'Error logging').default(false))
	.addOption(
		new Option('--la, --local-address <address>', 'Address/network interface')
	)
	.action(server);

program.parse(process.argv);
