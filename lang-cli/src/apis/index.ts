import axios from 'axios';
import { readSettingFile } from '../utils';
import { HOSTNAME, PROTOCOL } from '../constants/app-server-settings';

interface ResponseModel {
  code: number;
  data: Record<string, any>;
  msg: string;
}

const APIS = {
  TEST_CONNECT: '/test/connect',
  COMMANDS_STOP: '/commands/stop',
  COMMANDS_OPEN: '/commands/open',
};

function getUrl(route: string) {
  const { port } = readSettingFile();
  return `${PROTOCOL}//${HOSTNAME}:${port}/api${route}`;
}

/** 测试连接 */
export const testConnect = (): Promise<ResponseModel> =>
  axios.post(getUrl(APIS.TEST_CONNECT));

/** 关闭服务 */
export const stopServer = (): Promise<ResponseModel> =>
  axios.post(getUrl(APIS.COMMANDS_STOP));
