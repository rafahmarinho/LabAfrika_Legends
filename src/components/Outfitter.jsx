class Outfiter {
  constructor() {
    this.outfitLookupTable = [
      0xffffff, 0xffd4bf, 0xffe9bf, 0xffffbf, 0xe9ffbf, 0xd4ffbf, 0xbfffbf,
      0xbfffd4, 0xbfffe9, 0xbfffff, 0xbfe9ff, 0xbfd4ff, 0xbfbfff, 0xd4bfff,
      0xe9bfff, 0xffbfff, 0xffbfe9, 0xffbfd4, 0xffbfbf, 0xdadada, 0xbf9f8f,
      0xbfaf8f, 0xbfbf8f, 0xafbf8f, 0x9fbf8f, 0x8fbf8f, 0x8fbf9f, 0x8fbfaf,
      0x8fbfbf, 0x8fafbf, 0x8f9fbf, 0x8f8fbf, 0x9f8fbf, 0xaf8fbf, 0xbf8fbf,
      0xbf8faf, 0xbf8f9f, 0xbf8f8f, 0xb6b6b6, 0xbf7f5f, 0xbfaf8f, 0xbfbf5f,
      0x9fbf5f, 0x7fbf5f, 0x5fbf5f, 0x5fbf7f, 0x5fbf9f, 0x5fbfbf, 0x5f9fbf,
      0x5f7fbf, 0x5f5fbf, 0x7f5fbf, 0x9f5fbf, 0xbf5fbf, 0xbf5f9f, 0xbf5f7f,
      0xbf5f5f, 0x919191, 0xbf6a3f, 0xbf943f, 0xbfbf3f, 0x94bf3f, 0x6abf3f,
      0x3fbf3f, 0x3fbf6a, 0x3fbf94, 0x3fbfbf, 0x3f94bf, 0x3f6abf, 0x3f3fbf,
      0x6a3fbf, 0x943fbf, 0xbf3fbf, 0xbf3f94, 0xbf3f6a, 0xbf3f3f, 0x6d6d6d,
      0xff5500, 0xffaa00, 0xffff00, 0xaaff00, 0x54ff00, 0x00ff00, 0x00ff54,
      0x00ffaa, 0x00ffff, 0x00a9ff, 0x0055ff, 0x0000ff, 0x5500ff, 0xa900ff,
      0xfe00ff, 0xff00aa, 0xff0055, 0xff0000, 0x484848, 0xbf3f00, 0xbf7f00,
      0xbfbf00, 0x7fbf00, 0x3fbf00, 0x00bf00, 0x00bf3f, 0x00bf7f, 0x00bfbf,
      0x007fbf, 0x003fbf, 0x0000bf, 0x3f00bf, 0x7f00bf, 0xbf00bf, 0xbf007f,
      0xbf003f, 0xbf0000, 0x242424, 0x7f2a00, 0x7f5500, 0x7f7f00, 0x557f00,
      0x2a7f00, 0x007f00, 0x007f2a, 0x007f55, 0x007f7f, 0x00547f, 0x002a7f,
      0x00007f, 0x2a007f, 0x54007f, 0x7f007f, 0x7f0055, 0x7f002a, 0x7f0000,
    ];
  }

  static instance() {
    if (!this._instance) {
      this._instance = new Outfiter();
    }
    return this._instance;
  }

  prepareOutfit(file1, file2, imageTemplate, imageOutfit) {
    imageTemplate = new Image();
    imageTemplate.src = file1;
    imageOutfit = new Image();
    imageOutfit.src = file2;
  }

  colorizePixel(color, r, g, b) {
    const index = color < this.outfitLookupTable.length ? color : 0;
    const value = this.outfitLookupTable[index];
    const ro = (value & 0xff0000) >> 16;
    const go = (value & 0xff00) >> 8;
    const bo = value & 0xff;
    r = Math.floor(r * (ro / 255));
    g = Math.floor(g * (go / 255));
    b = Math.floor(b * (bo / 255));
  }

  colorize(imageTemplate, imageOutfit, head, body, legs, feet) {
    // Implement the logic for colorizing the images using Canvas API
    // Example: (note that this is a simplified example, actual implementation may vary)
    const canvas = document.getElementById("outfitCanvas");
    const ctx = canvas.getContext("2d");

    // Draw imageTemplate and imageOutfit on the canvas
    ctx.drawImage(imageTemplate, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(imageOutfit, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const templatePixel = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
      const outfitPixel =
        (data[i + 3] << 16) | (data[i + 4] << 8) | data[i + 5];

      if (templatePixel === outfitPixel) {
        continue;
      }

      const rt = (templatePixel >> 16) & 0xff;
      const gt = (templatePixel >> 8) & 0xff;
      const bt = templatePixel & 0xff;
      const ro = (outfitPixel >> 16) & 0xff;
      const go = (outfitPixel >> 8) & 0xff;
      const bo = outfitPixel & 0xff;

      if (rt && gt && !bt) {
        // yellow == head
        this.colorizePixel(head, ro, go, bo);
      } else if (rt && !gt && !bt) {
        // red == body
        this.colorizePixel(body, ro, go, bo);
      } else if (!rt && gt && !bt) {
        // green == legs
        this.colorizePixel(legs, ro, go, bo);
      } else if (!rt && !gt && bt) {
        // blue == feet
        this.colorizePixel(feet, ro, go, bo);
      } else {
        continue;
      }

      data[i] = ro;
      data[i + 1] = go;
      data[i + 2] = bo;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  outfit(outfit, addons, head, body, legs, feet) {
    const imageTemplate = "/* Load template image in JavaScript */";
    const imageOutfit = "/* Load outfit image in JavaScript */";

    this.colorize(imageTemplate, imageOutfit, head, body, legs, feet);

    return imageOutfit; // Return the resulting image
  }
  render(outfit, addons, head, body, legs, feet) {
    const canvas = document.getElementById("outfitCanvas");
    const ctx = canvas.getContext("2d");
    const resultImage = this.outfit(outfit, addons, head, body, legs, feet);
    ctx.drawImage(resultImage, 0, 0);
  }

  save(outfit, addons, head, body, legs, feet, file) {
    const canvas = document.getElementById("outfitCanvas");
    const ctx = canvas.getContext("2d");
    const resultImage = this.outfit(outfit, addons, head, body, legs, feet);
    ctx.drawImage(resultImage, 0, 0);

    // Implement the logic to save the canvas as an image (e.g., using toDataURL)
    // Example: (note that this is a simplified example, actual implementation may vary)
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = file;
    link.click();
  }
}

const outfiter = Outfiter.instance();

export const resultImage = ({ outfit, addons, head, body, legs, feet }) => {
  return outfiter.render(outfit, addons, head, body, legs, feet);
};
