export interface IWasmModule {
  wasmMemory: WebAssembly.Memory;
  _free_extracted_archive(resultPtr: number): void;
  UTF8ToString(filenamePtr: number): string;
  _malloc(size: number): number;
  _free(ptr: number): void;
  _extract(
    inputPtr: number,
    inputSize: number,
    decompressionOnly: boolean
  ): number;
  _archive_stream_open(inputPtr: number, inputSize: number, raw: boolean): number;
  _archive_stream_next_entry(streamPtr: number): number;
  _archive_stream_entry_path(streamPtr: number): number;
  _archive_stream_entry_size(streamPtr: number): number;
  _archive_stream_entry_time_flags(streamPtr: number): number;
  _archive_stream_entry_mtime(streamPtr: number): number;
  _archive_stream_entry_ctime(streamPtr: number): number;
  _archive_stream_read(streamPtr: number, outputPtr: number, outputSize: number): number;
  _archive_stream_error(streamPtr: number): number;
  _archive_stream_close(streamPtr: number): void;
  _extracted_file_time_flags(resultPtr: number, index: number): number;
  _extracted_file_name(resultPtr: number, index: number): number;
  _extracted_file_data(resultPtr: number, index: number): number;
  _extracted_file_size(resultPtr: number, index: number): number;
  _extracted_file_mtime(resultPtr: number, index: number): number;
  _extracted_file_ctime(resultPtr: number, index: number): number;
  getValue(ptr: number, type: string): number;
}

declare const unpack: {
  (options: { locateFile: (path: string) => string }): Promise<IWasmModule>;
};

export default unpack;
