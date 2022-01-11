import fetch from '../utils/fetch';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reqGetLang = (): Promise<any> => fetch.get('/settings/lang/get');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reqSetLang = (lang: string): Promise<any> =>
  fetch.post('/settings/lang/set', { lang });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reqGetAllProjects = (): Promise<any> =>
  fetch.get('/settings/all_projects');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reqGetProjectById = (id: number): Promise<any> =>
  fetch.get('/project/detail', { params: { id } });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reqSaveProjectById = (
  id: number,
  packages: PackageModel[],
  datasource: DatasourceModel[]
): Promise<any> => fetch.post('/project/save', { id, packages, datasource });
