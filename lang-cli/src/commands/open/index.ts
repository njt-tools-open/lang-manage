import { CommandModel } from '../../typings';
import { openEntryPage } from '../../utils';
import { findClientByName, openClientById } from '../../utils/client';
import tip from '../../utils/tip';

const open = ({ options }: CommandModel): void => {
  const { name } = options;

  if (!name) {
    openEntryPage();
    return;
  }
  const client = findClientByName(name);

  if (!client) {
    tip.error(`"${name}" is not in projects.`);
    return;
  }
  openClientById(client.id as number);
};

export default open;
