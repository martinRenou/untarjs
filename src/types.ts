export interface IFileData {
  filename: string;
  data: Uint8Array;
}

export interface IUnpackJSAPI {
  extractData: (data: Uint8Array) => Promise<IFileData[]>;
  extract: (url: string) => Promise<IFileData[]>;
}
