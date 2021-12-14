import { writeFileSync } from 'fs';
import path = require('path');
import { LangPackageSaveModel } from '../typings';
import { addClinet, getProjectUrl, readSettingFile } from './index';

const open = require('open');

interface OptionsModel {
  /** 项目名 */
  name: string;
  /** 语言包目录 */
  dir: string;
  /** 项目 id */
  id?: number;
}

class Client {
  constructor(options: OptionsModel) {
    this.options = options;

    if (typeof options.id === 'undefined') {
      this.createNewClient();
    }

    return this;
  }

  /** 项目配置信息 */
  public options?: OptionsModel;

  private createNewClient = () => {
    const options = this.options as OptionsModel;
    const { clients } = readSettingFile();

    const ids = clients.map((item: OptionsModel) => item.id);
    let id = ids.length;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < id; i++) {
      if (!ids.includes(i)) {
        id = i;
        break;
      }
    }

    const _options = { ...options, id };
    addClinet(_options);

    this.options = _options;
  };
}

export const createCleint = (options: OptionsModel): Client =>
  new Client(options);

export const findClient = (sign: string | number): OptionsModel | undefined => {
  const clients = readSettingFile().clients as OptionsModel[];

  const client =
    clients.find(item => item.id === sign) ||
    clients.find(item => item.name === sign);

  return client;
};

/** 通过项目 名称 读取项目信息 */
export const findClientByName = (sign: string): OptionsModel | undefined => {
  const clients = readSettingFile().clients as OptionsModel[];

  const client = clients.find(item => item.name === sign);

  return client;
};

/** 通过项目 id 读取项目信息 */
export const findClientById = (sign: number): OptionsModel | undefined => {
  const clients = readSettingFile().clients as OptionsModel[];

  const client = clients.find(item => item.id === sign);

  return client;
};

/** 通过项目 路径 读取项目信息 */
export const findClientByPath = (
  pathname: string
): OptionsModel | undefined => {
  const clients = readSettingFile().clients as OptionsModel[];

  const client = clients.find(item => item.dir === pathname);

  return client;
};

/** 通过 id 打开项目 web 页面 */
export const openClientById = (id: number): void => {
  open(getProjectUrl(id));
};

/** 通过 id 保存项目 */
export const saveClientById = (
  id: number,
  packages: LangPackageSaveModel[]
): 'FAILED' | 'SUCCESS' => {
  const client = findClientById(id);

  if (!client) return 'FAILED';

  const { dir } = client;

  packages.forEach(({ lang, content }) => {
    writeFileSync(`${path.join(dir, lang)}.json`, content, {
      encoding: 'utf8',
    });
  });

  return 'SUCCESS';
};
