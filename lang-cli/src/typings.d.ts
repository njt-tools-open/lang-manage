export interface CommandModel {
  options: Record<string, any>;
}

export interface LangPackageSaveModel {
  lang: string;
  content: string;
}

/** server & client */
export interface PackageModel {
  name: string;
  percent: number;
}

export interface DatasourceModel {
  name: string;
  data: Record<string, string>;
}
