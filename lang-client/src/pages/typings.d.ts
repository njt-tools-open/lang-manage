interface PackageModel {
  name: string;
  percent: number;
}

interface DatasourceModel {
  name: string;
  data: Record<string, string>;
}

interface ProjectModel {
  name: string;
  id: number;
  dir: string;
}

interface ProjectInfoModel {
  name: string;
  id: number;
  dir: string;
  packages: PackageModel[];
  datasource: DatasourceModel[];
}
