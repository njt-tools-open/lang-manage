import * as fs from 'fs';
import * as path from 'path';
import {
  DatasourceModel,
  LangPackageSaveModel,
  PackageModel,
} from '../../typings';
import { findClientById } from '../client';

const { join } = path;

const readFileSync = (filePath: string) =>
  JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }).toString());

interface JsonFileStructure {
  path: string;
  name: string;
  content: Record<string, any>;
}

function getJsonFiles(path: string) {
  const jsonFiles: JsonFileStructure[] = [];
  const files = fs.readdirSync(path);
  files.forEach(filename => {
    if (!/json$/.test(filename)) return;

    const fPath = join(path, filename);
    const stat = fs.statSync(fPath);

    if (stat.isFile() === true) {
      const content = readFileSync(fPath);
      jsonFiles.push({
        path: fPath,
        name: filename.replace(/\.json$/i, ''),
        content,
      });
    }
  });
  return jsonFiles;
}

const mergeKeys = (keys: string[], appends: string[]) => {
  appends.forEach(key => {
    if (keys.indexOf(key) === -1) {
      keys.push(key);
    }
  });
};

const getAllKeys = (fileList: JsonFileStructure[]) => {
  let keys: string[] = [];
  fileList.forEach(item => {
    const _keys = Object.keys(item.content);
    if (!keys.length) {
      keys = _keys;
    } else {
      mergeKeys(keys, _keys);
    }
  });
  return keys;
};

interface CleanData {
  name: string;
  data: Record<string, any>;
}

const formatDatasource = (keys: string[], files: JsonFileStructure[]) => {
  const result: CleanData[] = [];
  keys.forEach(key => {
    const data: Record<string, any> = {};
    files.forEach(file => {
      data[file.name] = file.content[key];
    });
    result.push({
      name: key,
      data,
    });
  });
  return result;
};

interface LangFileInfo {
  percent: number;
}

/** 获取每个语言文件信息(完成百分比) */
const extractPackages = (files: JsonFileStructure[], keys: string[]) => {
  const result: Record<string, LangFileInfo> = {};
  let filledLength = 0;
  files.forEach(item => {
    filledLength = Object.keys(item.content).filter(
      key => !!item.content[key]
    ).length;
    result[item.name] = {
      percent: Math.floor((filledLength * 100) / keys.length) / 100,
    };
  });
  return Reflect.ownKeys(result).map(name => ({
    name,
    ...result[name as string],
  }));
};

/**
 * 获取目录下所有语言包文件数据, 并进行格式化处理
 * @param {string} pathname - 语言包目录
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getFiles = (pathname: string) => {
  const files = getJsonFiles(pathname);
  const keys = getAllKeys(files).sort();
  const packages = extractPackages(files, keys);

  const result = {
    packages,
    datasource: formatDatasource(keys, files),
  };
  return result;
};

/* MARK: new */

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getProjectLangPackages = (id: number) => {
  const client = findClientById(id);

  if (!client) return null;

  return getFiles(client.dir);
};

export const formatToSaveContent = (
  packages: PackageModel[],
  datasource: DatasourceModel[]
): LangPackageSaveModel[] => {
  const filesObject = packages.map(({ name }) => {
    const contentObject: Record<string, string> = {};
    datasource.forEach(item => {
      contentObject[item.name] = item.data[name] || '';
    });
    return {
      lang: name,
      content: JSON.stringify(contentObject, null, 2),
    };
  });
  return filesObject;
};
