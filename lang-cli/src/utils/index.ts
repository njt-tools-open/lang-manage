/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { readFileSync, statSync, writeFileSync } from 'fs';
import * as net from 'net';
import * as path from 'path';
import * as settings from '../constants/settings';
import { findClientByName } from './client';
import tip from './tip';

const YAML = require('yaml');
const open = require('open');

const call = (obj: any): string => Object.prototype.toString.call(obj);

export const isPromise = (obj: any): boolean =>
  call(obj) === '[object Promise]';

export const isFunction = (obj: any): boolean =>
  call(obj) === '[object Function]';

export const isFolder = (name: string): boolean => {
  try {
    const stats = statSync(name);
    return stats.isDirectory();
  } catch (_error) {
    return false;
  }
};

export const isFile = (name: string): boolean => {
  try {
    const stats = statSync(name);
    return !stats.isDirectory();
  } catch (_error) {
    return false;
  }
};

export const json2yaml = (json: Record<string, any>): string =>
  YAML.stringify(json);

export const yaml2json = (json: string): Record<string, any> =>
  YAML.parse(json);

// 检测端口是否被占用
export const portIsOccupied = (port: number): Promise<number> =>
  new Promise((resolve, reject) => {
    const server = net.createServer().listen(port);

    server.on('listening', () => {
      server.close(); // 关闭服务
      resolve(port);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // 端口已经被使用
        tip.error(`The port [${port}] is occupied, please change other port.`);
        resolve(portIsOccupied(port + 1));
      } else {
        reject(err);
      }
    });
  });

export const readSettingFile = () =>
  yaml2json(
    readFileSync(settings.clientsSettingFilename, { encoding: 'utf8' })
  );

export const writeSettingFile = (fileObj: Record<string, any>) => {
  writeFileSync(settings.clientsSettingFilename, json2yaml(fileObj), {
    encoding: 'utf8',
  });
};

export const getPackage = () =>
  JSON.parse(
    readFileSync(path.join(__dirname, '../../package.json'), {
      encoding: 'utf8',
    })
  );

/** 获取项目打开 url */
export const getProjectUrl = (id: number) => {
  const { port } = readSettingFile();
  return `http://localhost:${port}/client/${id}`;
};

/** 修改 lang */
export const setLang = (lang: string) => {
  const pathname = settings.clientsSettingFilename;
  const content = yaml2json(readFileSync(pathname, { encoding: 'utf8' }));

  content.lang = lang;

  writeFileSync(pathname, json2yaml(content), { encoding: 'utf8' });
};

/** 添加 client */
export const addClinet = (options: any) => {
  const pathname = settings.clientsSettingFilename;
  const content = yaml2json(readFileSync(pathname, { encoding: 'utf8' }));
  content.clients.push(options);

  content.clients.sort((current: any, next: any) => current.id - next.id);

  writeFileSync(pathname, json2yaml(content), { encoding: 'utf8' });
};

/** 删除 client */
export const deleteClient = ({
  id,
  name,
}: {
  id?: number;
  name?: string;
}): void => {
  if (typeof id === 'undefined' && typeof name === 'undefined') {
    tip.error('"id" or "name" is must!');
    return;
  }
  const data = readSettingFile();
  let deleteIndex = -1;

  if (typeof id !== 'undefined') {
    deleteIndex = data.clients.findIndex((item: any) => item.id === id);
  } else if (typeof name !== 'undefined') {
    const client = findClientByName(name);
    deleteIndex = data.clients.findIndex(
      (item: any) => item.name === client?.name
    );
  }

  if (deleteIndex === -1) {
    tip.error('Project is not found');
    return;
  }
  data.clients.splice(deleteIndex, 1);
  writeSettingFile(data);
};

/** 打开项目管理入口页面 */
export const openEntryPage = () => {
  const { port } = readSettingFile();
  open(`http://localhost:${port}/`);
};
