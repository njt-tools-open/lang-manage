import * as os from 'os';
import * as path from 'path';

/** 配置目录 */
export const settingFolder = path.join(os.homedir(), '.xl-settings');

/** 各项目配置 */
export const clientsSettingFilename = path.join(
  settingFolder,
  'setting.clients.yml'
);
