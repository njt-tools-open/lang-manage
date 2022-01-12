import { CommandModel } from '../../typings';
import { deleteClient } from '../../utils';

const del = ({ options }: CommandModel): void => {
  deleteClient(options);
};

export default del;
