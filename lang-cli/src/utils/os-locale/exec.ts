// Mini wrapper around `child_process` to make it behave a little like `execa`.

import * as childProcess from 'child_process';

/**
@param {string} command
@param {string[]} arguments_

@returns {string}
*/
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function execSync(command: string, args: string[]) {
  return childProcess
    .execFileSync(command, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
    .trim();
}
