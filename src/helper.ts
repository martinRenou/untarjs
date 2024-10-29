import unpack, { WasmModule } from "./unpack";
import unpackWasm from "./unpack.wasm";

const initializeWasm = async (): Promise<WasmModule | undefined> => {
    try {
        const wasmModule: WasmModule = await unpack({
            locateFile(path: string) {
                if (path.endsWith('.wasm')) {
                    return unpackWasm;
                }
                return path;
            },
        });

        console.log("WASM module initialized:", wasmModule);
        
        return wasmModule;
    } catch (err) {
        console.error('Error initializing the WASM module:', err);
        return undefined;
    }
};
export default initializeWasm;