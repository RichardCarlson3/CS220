import assert from "assert";
import { COLORS, Image } from "../include/image.js";
import { flipColors, saturateGreen, mapLine, imageMap, mapFlipColors, mapToGreen } from "./imageProcessing.js";

describe("saturateGreen", () => {
  it("should maximize green in the upper left corner", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(0, 0);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");

    // or alternatively, using jest, if you'd like
    // https://jestjs.io/docs/expect#toequalvalue
    // Use expect with .toEqual to compare recursively all properties of object instances (also known as "deep" equality).

    expect(p).toEqual([0, 255, 0]);

    // This will produce output showing the exact differences between the two objects, which is really helpful
    // for debugging. However, again, please use the simpler assert syntax if this is too confusing.
    // Focus on making your tests well written and correct, rather than using one syntax or another.
  });

  it("should maximize green in the center", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(5, 7);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });
  it("should maximize green in bottom right corner", () => {
    const whiteImage = Image.create(10, 15, COLORS.WHITE);
    const gwImage = saturateGreen(whiteImage);
    const p = gwImage.getPixel(9, 14);

    assert(p[0] === 255, "The red channel should be 255.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 255, "The blue channel should be 255.");
  });
  it("Checks if whole image is saturated green", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    for (let x = 0; x < blackImage.width; x++) {
      for (let y = 0; y < blackImage.height; y++) {
        const p = gbImage.getPixel(x, y);

        assert(p[0] === 0, "The red channel should be 0.");
        assert(p[1] === 255, "The green channel should be 255.");
        assert(p[2] === 0, "The blue channel should be 0.");
      }
    }
  });
  it("Tests a small image", () => {
    const randomImg = Image.create(1, 1, [67, 81, 21]);
    const grandomImg = saturateGreen(randomImg);
    for (let x = 0; x < randomImg.width; x++) {
      for (let y = 0; y < randomImg.height; y++) {
        const p = grandomImg.getPixel(x, y);

        assert(p[0] === 67, "The red channel should be 67.");
        assert(p[1] === 255, "The green channel should be 255.");
        assert(p[2] === 21, "The blue channel should be 21.");
      }
    }
  });

  // More tests for saturateGreen go here.
});

describe("flipColors", () => {
  it("should correctly flip top left corner", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(0, 0, [100, 0, 150]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(0, 0);

    assert(p[0] === 75, "Red channel should be 75");
    assert(p[1] === 125, "Green channel should be 125");
    assert(p[2] === 50, "Blue channel should be 50");
  });
  it("should correctly flip the middle", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(4, 5, [0, 200, 255]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(4, 5);

    assert(p[0] === 227, "Red channel should be 227");
    assert(p[1] === 127, "Green channel should be 127");
    assert(p[2] === 100, "Blue channel should be 100");
  });
  it("should correctly flip the bottom right corner", () => {
    const blackImage = Image.create(15, 15, COLORS.BLACK);
    // A white image is not particularly helpful in this context
    blackImage.setPixel(14, 14, [13, 77, 182]);
    const flippedBlackImage = flipColors(blackImage);
    const p = flippedBlackImage.getPixel(14, 14);

    assert(p[0] === 129, "Red channel should be 129");
    assert(p[1] === 97, "Green channel should be 97");
    assert(p[2] === 45, "Blue channel should be 45");
  });

  // More tests for flipColors go here.
  it("Checks if whole image is flipped", () => {
    const randomImg = Image.create(15, 15, [13, 77, 182]);
    const flippedRImg = flipColors(randomImg);
    for (let x = 0; x < randomImg.width; x++) {
      for (let y = 0; y < randomImg.height; y++) {
        const p = flippedRImg.getPixel(x, y);

        assert(p[0] === 129, "Red channel should be 129");
        assert(p[1] === 97, "Green channel should be 97");
        assert(p[2] === 45, " Blue channel should be 45");
      }
    }
  });
  it("Checks a small image", () => {
    const randomImg = Image.create(1, 1, [17, 67, 38]);
    const flippedRImg = flipColors(randomImg);
    for (let x = 0; x < randomImg.width; x++) {
      for (let y = 0; y < randomImg.height; y++) {
        const p = flippedRImg.getPixel(x, y);

        assert(p[0] === 52, "Red channel should be 52");
        assert(p[1] === 27, "Green channel should be 27");
        assert(p[2] === 42, " Blue channel should be 42");
      }
    }
  });
});
 
describe("mapLine", () => {
  // Tests for mapLine go here.
  it("Test if lineNo is integer", () => {
    const img = Image.create(5, 5, COLORS.BLACK);
    const beforeImg = img.copy();
    mapLine(img, 2.5, ([_r, _g, _b]) => [255, 255, 255]);
    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        const pixel = img.getPixel(x, y);
        const expected = beforeImg.getPixel(x, y);
        assert.deepEqual(pixel, expected, "Should be no change");
      }
    }
  });
  it("shouldn't do anything if lineNo < 0", () => {
    const img = Image.create(5, 5, COLORS.BLACK);
    const beforeImg = img.copy();
    mapLine(img, -1, ([_r, _g, _b]) => [255, 255, 255]);
    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        const pixel = img.getPixel(x, y);
        const expected = beforeImg.getPixel(x, y);
        assert.deepEqual(pixel, expected, "Should be no change");
      }
    }
  });
  it("shouldn't do anything if lineNo > img.height", () => {
    const img = Image.create(10, 10, COLORS.BLACK);
    const beforeImg = img.copy();
    mapLine(img, 10, ([_r, _g, _b]) => [100, 100, 100]);
    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        const pixel = img.getPixel(x, y);
        const expected = beforeImg.getPixel(x, y);
        assert.deepEqual(pixel, expected, "Should be no change");
      }
    }
  });
  it("test if the right line in the map will change color", () => {
    const img = Image.create(10, 10, [0, 100, 200]);
    const beforeImg = img.copy();
    mapLine(img, 5, ([_r, _g, _b]) => [25, 50, 75]);

    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        if (y !== 5) {
          const pixel = img.getPixel(x, y);
          const expected = beforeImg.getPixel(x, y);
          assert.deepEqual(pixel, expected, "Pixel colors shouldn't change");
        }
        if (y == 5) {
          const pixel = img.getPixel(x, y);
          const expected = [25, 50, 75];
          assert.deepEqual(pixel, expected, "Pixel color != [25, 50, 75]");
        }
      }
    }
  });
  it("test if correct line in the map will change color", () => {
    const img = Image.create(6, 7, [67, 13, 123]);
    const beforeImg = img.copy();
    mapLine(img, 3, ([_r, _g, _b]) => [11, 22, 33]);

    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        if (y !== 3) {
          const pixel = img.getPixel(x, y);
          const expected = beforeImg.getPixel(x, y);
          assert.deepEqual(pixel, expected, "Should be no change");
        }
        if (y == 3) {
          const pixel = img.getPixel(x, y);
          const expected = [11, 22, 33];
          assert.deepEqual(pixel, expected, "Pixel color != [11, 23, 33]");
        }
      }
    }
  });
});

describe("imageMap", () => {
  // Tests for imageMap go here.
  it("test if imageMap changes whole image color", () => {
    const img = Image.create(10, 10, [0, 100, 200]);
    const newImg = imageMap(img, ([_r, _g, _b]) => [25, 50, 75]);

    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        const pixel = newImg.getPixel(x, y);
        const expected = [25, 50, 75];
        assert.deepEqual(pixel, expected, "Map should = [25, 50, 75]");
      }
    }
  });
  it("test if imageMap correctly changes the map color", () => {
    const img = Image.create(6, 7, [144, 17, 8]);
    const newImg = imageMap(img, ([_r, _g, _b]) => [67, 81, 23]);

    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        const pixel = newImg.getPixel(x, y);
        const expected = [67, 81, 23];
        assert.deepEqual(pixel, expected, "Map color should = [67, 81, 23]");
      }
    }
  });
});

describe("mapToGreen", () => {
  // Tests for mapToGreen go here.
  it("test if whole map will get distorted green", () => {
    const img = Image.create(10, 10, [0, 0, 0]);
    const newImg = mapToGreen(img);

    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        const pixel = newImg.getPixel(x, y);
        const expected = [0, 255, 0];
        assert.deepEqual(pixel, expected, "Map color should = [0, 255, 0]");
      }
    }
  });
  it("checks if distorted green", () => {
    const img = Image.create(1, 1, [255, 255, 255]);
    const newImg = mapToGreen(img);

    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        const pixel = newImg.getPixel(x, y);
        const expected = [255, 255, 255];
        assert.deepEqual(pixel, expected, "Should be white [255, 255, 255]");
      }
    }
  });
});

describe("mapFlipColors", () => {
  // Tests for mapFlipColors go here.
  it("test if whole map flips colors", () => {
    const img = Image.create(10, 10, [75, 200, 125]);
    const newImg = mapFlipColors(img);
    for (let x = 0; x < newImg.width; x++) {
      for (let y = 0; y < newImg.height; y++) {
        const pixel = newImg.getPixel(x, y);
        const expected = [162, 100, 137];
        assert.deepEqual(pixel, expected, "Flipped map color should be [162, 100, 137]");
      }
    }
  });
  it("test if map will flip colors", () => {
    const img = Image.create(1, 1, [67, 14, 23]);
    const newImg = mapFlipColors(img);
    for (let x = 0; x < newImg.width; x++) {
      for (let y = 0; y < newImg.height; y++) {
        const pixel = newImg.getPixel(x, y);
        const expected = [18, 45, 40];
        assert.deepEqual(pixel, expected, "Flipped map color should be [18, 45, 40]");
      }
    }
  });
});
