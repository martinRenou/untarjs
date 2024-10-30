export interface IWasmModule {
  HEAPU8: Uint8Array;
  _malloc(size: number): number;
  _free(ptr: number): void;
  _extract_archive(
    inputPtr: number,
    inputSize: number,
    outputSizePtr: number
  ): number;
  getValue(ptr: number, type: string): number;
}

declare const unpack: {
  (options: { locateFile: (path: string) => string }): Promise<IWasmModule>;
};

export default unpack;
