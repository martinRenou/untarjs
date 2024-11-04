import untarjs from '../src/index';

jest.mock('../src/helper', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../src/index', () => {
  return {
    extract: jest.fn(),
    extractData: jest.fn(),
  };
});

describe('extract', () => {
  it('should download and extract data successfully', async () => {
    const mockData = new Uint8Array([1, 2, 3, 4]);
    const extractedData = new Uint8Array([5, 6, 7, 8]);

    const mockFetchByteArray = jest.fn().mockResolvedValue(mockData);
    const mockExtractData = jest.fn().mockResolvedValue(extractedData);

    (untarjs.extract as jest.Mock).mockImplementation(async (url: string) => {
      const data = await mockFetchByteArray(url);
      return await mockExtractData(data);
    });

    const condaPackageUrl = 'https://conda.anaconda.org/conda-forge/linux-64/_libgcc_mutex-0.1-conda_forge.tar.bz2';
    const result = await untarjs.extract(condaPackageUrl);

    expect(result).toEqual(extractedData);
    expect(mockFetchByteArray).toHaveBeenCalledWith(condaPackageUrl);
    expect(mockExtractData).toHaveBeenCalledWith(mockData);
  });
});
