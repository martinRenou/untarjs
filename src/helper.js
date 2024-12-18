import unpackaging from "../lib/unpack";
import unpackagingWasm from "../lib/unpack.wasm";

const initializeWasm = async () => {
    try {
        const wasmModule = await unpackaging({
            locateFile(path) {
                console.log('path', path);
                if (path.endsWith('.wasm')) {
                    return unpackagingWasm;
                }
                return path;
            },
        });

        console.log("WASM module initialized:", wasmModule);
        
        return wasmModule;
    } catch (err) {
        console.error('Error initializing the WASM module:', err);
    }
};
export default initializeWasm;