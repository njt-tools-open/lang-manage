import { mkdirSync, writeFileSync } from 'fs';
import { spawn } from 'child_process';
import path = require('path');
import {
  portIsOccupied,
  readSettingFile,
  isFolder,
  isFile,
  json2yaml,
} from './index';
import * as constants from '../constants/settings';
import { EvoData, flowsCompose } from './flow-exec';
import { testConnect } from '../apis';
import tip from './tip';

/** 创建客户端配置文件默认内容 */
function getDefaultClientsFileContent() {
  const time = new Date().toLocaleString();
  const content = {
    name: 'lang-manage-clients',
    createTime: time,
    updateTime: time,
    port: 11000,
    clients: [],
  };
  return json2yaml(content);
}

/** 判断配置目录是否存在 */
function isExistSettingFolder() {
  return isFolder(constants.settingFolder);
}

/** 尝试创建配置目录 */
const tryCreateSettingFolder = () => {
  if (isExistSettingFolder()) return 0;

  return () => {
    mkdirSync(constants.settingFolder, { recursive: true });
  };
};

/** 尝试创建配置文件 */
function tryCreateClientFile(name: string, content: string) {
  return () => {
    if (isFile(name)) return 0;

    return () => {
      writeFileSync(name, content, { encoding: 'utf8' });
    };
  };
}

/** 判断是否已经启动 */
function getServerStatus(data: EvoData): 0 | Promise<any> {
  const { useServer } = data.state;

  if (!useServer) return 0;

  return new Promise(resolve => {
    testConnect()
      .then(res => {
        resolve({ isRunning: res.data.code === 0 });
      })
      .catch(_error => {
        resolve({ isRunning: false });
      });
  });
}

interface ServerRunStatus {
  status: 'RUNNING' | 'STOP';
  port?: number;
}

/** 获取可用端口 */
function getServerPort(data: EvoData): 0 | Promise<ServerRunStatus> {
  const { state, param } = data;
  const { useServer } = state;

  if (!param || !useServer) return 0;

  return new Promise((resolve, reject) => {
    if (param.isRunning) {
      resolve({ status: 'RUNNING' });
      return;
    }
    const { port } = readSettingFile();
    portIsOccupied(port)
      .then(newPort => {
        resolve({ status: 'STOP', port: newPort });
      })
      .catch(error => {
        reject(error);
      });
  });
}

/** 创建服务 */
function createAppServer(data: EvoData) {
  const { state, param } = data;

  if (!param) return 0;

  const { status, port } = param;
  const { useServer } = state;

  if (!useServer || status === 'RUNNING') return 0;

  return () => {
    tip.info('Starting server . . .');
    const subprocess = spawn(
      'node',
      [path.join(__dirname, 'serve/app.js'), String(port)],
      {
        detached: true,
        stdio: 'ignore',
        argv0: String(port),
      }
    );
    subprocess.unref();
  };
}

/** 执行指令前, 进行初始化流程 */
function initialize(state: Record<string, any>, callback: () => void): void {
  flowsCompose(state)
    .exec(tryCreateSettingFolder)
    .exec(
      tryCreateClientFile(
        constants.clientsSettingFilename,
        getDefaultClientsFileContent()
      )
    )
    .exec(getServerStatus)
    .exec(getServerPort)
    .exec(createAppServer)
    .exec(() => callback);
}

export default initialize;
