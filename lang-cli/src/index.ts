#!/usr/bin/env node

import { Command } from 'commander';
import { COMMANDS } from './constants/commands';
import test from './commands/test';
import start from './commands/start';
import list from './commands/list';
import stop from './commands/stop';
import open from './commands/open';
import initialize from './utils/initialize-settings';
import { getPackage } from './utils';

const program = new Command();

program.version(getPackage().version);

const commands = [
  {
    command: COMMANDS.TEST,
    desc: 'Testing connect . . .',
    action: test,
  },
  {
    command: COMMANDS.START,
    desc: 'Add current folder local file to cache.',
    action: start,
  },
  {
    command: COMMANDS.LIST,
    desc: 'Show projects list.',
    action: list,
  },
  {
    command: COMMANDS.STOP,
    desc: 'Stop translate server.',
    action: stop,
  },
  {
    command: COMMANDS.OPEN,
    desc: 'Open project locals file in browser.',
    action: open,
  },
];

const options = [
  {
    content: '-f, --folder <folder>',
    // eslint-disable-next-line quotes
    desc: "Project's locals files folder.",
  },
  {
    content: '-n, --name <name>',
    // eslint-disable-next-line quotes
    desc: "Project's name.",
  },
  {
    content: '-i, --id',
    // eslint-disable-next-line quotes
    desc: "Project's id.",
  },
];

const noNeedStartServer = (command: string) => ['stop'].includes(command);

options.forEach(({ content, desc }) => {
  program.option(content, desc);
});

commands.forEach(({ command, desc, action }) => {
  program
    .command(`${command}`)
    .description(desc)
    .action(() => {
      initialize({ command, useServer: !noNeedStartServer(command) }, () => {
        action({
          options: program.opts(),
        });
      });
    });
});

program.parse(process.argv);
