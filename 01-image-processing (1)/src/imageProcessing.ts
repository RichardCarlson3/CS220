import type { Color, Image } from "../include/image.js";

/**
 * Saturates green color in each pixel of an image
 * @param img An image
 * @returns A new image where each pixel has the green channel set to its maximum.
 */
export function saturateGreen(img: Image): Image {
  // TODO
  const imgCopy = img.copy();
  for (let xCord = 0; xCord < img.width; xCord++) {
    for (let yCord = 0; yCord < img.height; yCord++) {
      const imgColor = img.getPixel(xCord, yCord);
      imgColor[1] = 255;
      imgCopy.setPixel(xCord, yCord, imgColor);
    }
  }
  return imgCopy;
}

/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixel's channel has been
 *  set as the truncated average of the other two
 */
export function flipColors(img: Image): Image {
  // TODO
  const imgCopy = img.copy();
  for (let xCord = 0; xCord < img.width; xCord++) {
    for (let yCord = 0; yCord < img.height; yCord++) {
      const imgColor = img.getPixel(xCord, yCord);
      const avgColor = [
        Math.floor((imgColor[1] + imgColor[2]) / 2),
        Math.floor((imgColor[0] + imgColor[2]) / 2),
        Math.floor((imgColor[0] + imgColor[1]) / 2),
      ];
      imgCopy.setPixel(xCord, yCord, avgColor);
    }
  }
  return imgCopy;
}

/**
 * Modifies the given `img` such that the value of each pixel
 * in the given line is the result of applying `func` to the
 * corresponding pixel of `img`. If `lineNo` is not a valid line
 * number, then `img` should not be modified.
 * @param img An image
 * @param lineNo A line number
 * @param func A color transformation function
 */
export function mapLine(img: Image, lineNo: number, func: (c: Color) => Color): void {
  // TODO
  if (lineNo < 0 || lineNo >= img.height || !Number.isInteger(lineNo)) {
    return;
  }
  for (let xCord = 0; xCord < img.width; xCord++) {
    img.setPixel(xCord, lineNo, func(img.getPixel(xCord, lineNo)));
  }
}

/**
 * The result must be a new image with the same dimensions as `img`.
 * The value of each pixel in the new image should be the result of
 * applying `func` to the corresponding pixel of `img`.
 * @param img An image
 * @param func A color transformation function
 */
export function imageMap(img: Image, func: (c: Color) => Color): Image {
  // TODO
  const imgCopy = img.copy();
  for (let yCord = 0; yCord < img.height; yCord++) {
    mapLine(imgCopy, yCord, func);
  }
  return imgCopy;
}

/**
 * Saturates green color in an image
 * @param img An image
 * @returns A new image where each pixel has the green channel has been set to its maximum.
 */
export function mapToGreen(img: Image): Image {
  // TODO
  return imageMap(img, imgColor => [imgColor[0], 255, imgColor[2]]);
}

/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixels channel has been
 *  set as the truncated average of the other two
 */
export function mapFlipColors(img: Image): Image {
  // TODO
  return imageMap(img, imgColor => [
    Math.floor((imgColor[1] + imgColor[2]) / 2),
    Math.floor((imgColor[0] + imgColor[2]) / 2),
    Math.floor((imgColor[0] + imgColor[1]) / 2),
  ]);
}
