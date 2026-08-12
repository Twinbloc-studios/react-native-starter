import type * as BlurhashType from '../blurhash';

const mockEncode = jest.fn();

// react-native-blurhash is an optional template dependency — not installed by
// default, so register the mock as virtual.
jest.mock(
  'react-native-blurhash',
  () => ({
    Blurhash: {
      encode: (...args: unknown[]) => mockEncode(...args),
    },
  }),
  { virtual: true },
);

describe('generateBlurhash', () => {
  beforeEach(() => {
    jest.resetModules();
    mockEncode.mockReset();
  });

  const load = () => {
    return require('../blurhash') as typeof BlurhashType;
  };

  it('returns the hash from the native module with default components', async () => {
    mockEncode.mockResolvedValue('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
    const { generateBlurhash } = load();

    await expect(generateBlurhash('file:///tmp/image.jpg')).resolves.toBe(
      'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
    );
    expect(mockEncode).toHaveBeenCalledWith('file:///tmp/image.jpg', 4, 3);
  });

  it('passes through custom component counts', async () => {
    mockEncode.mockResolvedValue('hash');
    const { generateBlurhash } = load();

    await generateBlurhash('file:///tmp/image.jpg', 8, 6);

    expect(mockEncode).toHaveBeenCalledWith('file:///tmp/image.jpg', 8, 6);
  });

  it('returns null when encoding fails', async () => {
    mockEncode.mockRejectedValue(new Error('decode failed'));
    const { generateBlurhash } = load();

    await expect(generateBlurhash('file:///tmp/image.jpg')).resolves.toBeNull();
  });
});
