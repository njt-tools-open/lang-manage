// import { findClient } from '../../utils/client';
import path = require('path');
import { CommandModel } from '../../typings';
import { isFolder } from '../../utils';
import {
  createCleint,
  findClientByPath,
  openClientById,
} from '../../utils/client';
import tip from '../../utils/tip';

const start = ({ options }: CommandModel): void => {
  const { folder, name } = options;
  if (!folder || !name) {
    tip.error('Folder and name is must.');
    return;
  }
  const pathname = path.resolve(folder);
  const client = findClientByPath(pathname);

  if (!isFolder(pathname)) {
    tip.error(`"${folder}" is not a folder.`);
    return;
  }

  if (client) {
    openClientById(client.id as number);
    return;
  }

  const newClient = createCleint({ name: name as string, dir: pathname });

  openClientById(newClient.options?.id as number);
};

export default start;
