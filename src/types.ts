export interface IFileData {
  content: Uint8Array | undefined;
  ctime: string;
  mtime: string;
  size?: number;
}

export type FilesData = { [filename: string]: IFileData };

export interface ExtractedFileChunk {
  path: string;
  size: number;
  ctime: string;
  mtime: string;
  offset: number;
  data: Uint8Array;
  final: boolean;
}

export interface IUnpackJSAPI {
  extractData: (data: Uint8Array, decompressionOnly?: boolean) => Promise<FilesData>;
  extract: (url: string) => Promise<FilesData>;
  extractDataStream: (
    data: Uint8Array,
    decompressionOnly?: boolean
  ) => AsyncGenerator<ExtractedFileChunk>;
  extractStream: (url: string) => AsyncGenerator<ExtractedFileChunk>;
}
