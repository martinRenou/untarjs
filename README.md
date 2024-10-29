## Unpack

Fetching and unpacking conda packages. This package uses compiled `libarchive` and supports of  which support next archive formats:
- Tar-based formats: tar, ustar,
- Compressed formats: gzip, bzip2, xz, lzma, lz4, zstd.
- Other archive formats: zip, ar, 7z, cab, rar, etc.


> Note: To add the support of another archive format,  `libarchive` should be compiled again with `with-[name-archve-lib]` into wasm here [Libarchive recipe](https://github.com/emscripten-forge/recipes/blob/main/recipes/recipes_emscripten/libarchive/build.sh#L11) and then run `yarn run build` in this project to make new unpack.js and unpack.wasm files.

## Release

In order to make a new release:
- Update the version in `package.json`
- Commit the change with the message "Release x.x.x" on the `main` branch
- Create a tag `git tag x.x.x`
- Push the new commit and the tag `git push https://github.com/emscripten-forge/untarjs main x.x.x`
- Build and publish `git clean -fdx && yarn && yarn run build:prod && npm publish`

## Using

This package has 2 methods: 
- extract(url) - downloads an archive throught the url and returns extracted archive data in Uint8Array.
- exctractData(data) - accepts Uint8Array archive data and returns exracted data.

Example of using:
```sh
import untarjs from "@emscripten-forge/untarjs"

const condaPackageUrl = 'https://conda.anaconda.org/conda-forge/linux-64/_libgcc_mutex-0.1-conda_forge.tar.bz2';
const test = untarjs.extract(condaPackageUrl);
console.log(test);
```