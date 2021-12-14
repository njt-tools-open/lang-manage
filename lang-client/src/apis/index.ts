import fetch from '../utils/fetch';

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
