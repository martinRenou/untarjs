export type FilesData = {[key: string]: Uint8Array};

export interface IUnpackJSAPI {
  extractData: (data: Uint8Array) => Promise<FilesData>;
  extract: (url: string) => Promise<FilesData>;
}
