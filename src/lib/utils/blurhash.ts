/**
 * Generates a blurhash string from an image URI.
 *
 * This is a template utility. If you use it, install react-native-blurhash
 * with the package manager you use for this project.
 *
 * @param imageUri - The local URI of the image (e.g. file://...).
 * @param componentX - The number of components in the X direction (default 4).
 * @param componentY - The number of components in the Y direction (default 3).
 * @returns The blurhash string or null if generation fails.
 *
 * @example
 * const hash = await generateBlurhash('file:///path/to/image.jpg');
 * console.log(hash); // "LEHV6nWB2yk8pyo0adR*.7kCMdnj"
 */
export const generateBlurhash = async (
  imageUri: string,
  componentX: number = 4,
  componentY: number = 3,
): Promise<string | null> => {
  try {
    const blurhashModule = require("react-native-blurhash") as {
      Blurhash: {
        encode: (uri: string, x: number, y: number) => Promise<string>;
      };
    };
    const hash = await blurhashModule.Blurhash.encode(
      imageUri,
      componentX,
      componentY,
    );
    return hash;
  } catch (error) {
    console.error("Failed to generate blurhash:", error);
    return null;
  }
};
