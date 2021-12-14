import { table } from 'table';
import { readSettingFile } from '../../utils';

const list = (..._args: any[]): void => {
  const { clients } = readSettingFile();

  const header = ['name', 'id', 'dir'];
  const body = clients.map((item: { [x: string]: any }) => [
    item[header[0]],
    item[header[1]],
    item[header[2]],
  ]);
  const data = [header, ...body];

  console.log(table(data));
};

export default list;
