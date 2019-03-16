import { external } from './externalModules.js';

const canvas = document.createElement('canvas');
let lastImageIdDrawn;

/**
 * creates a cornerstone Image object for the specified Image and imageId
 *
 * @param image - An Image
 * @param imageId - the imageId for this image
 * @returns Cornerstone Image Object
 */
export default function (image, imageId) {
  // extract the attributes we need
  const rows = image.naturalHeight;
  const columns = image.naturalWidth;
  
  // save values to avoid duplicate calculation
  let intensityData;

  function getPixelData () {
    const imageData = getImageData();


    return imageData.data;
  }

  function getIntensityData () {
    return intensityData || calculateIntensity();
  }

  function getImageData () {
    let context;

    if (lastImageIdDrawn === imageId) {
      context = canvas.getContext('2d');
    } else {
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      lastImageIdDrawn = imageId;
    }

    return context.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
  }

  function getCanvas () {
    if (lastImageIdDrawn === imageId) {
      return canvas;
    }

    canvas.height = image.naturalHeight;
    canvas.width = image.naturalWidth;
    const context = canvas.getContext('2d');

    context.drawImage(image, 0, 0);
    lastImageIdDrawn = imageId;

    return canvas;
  }

  function calculateIntensity() {
    const pixelData = getPixelData();
    const intensityDataLength = rows * columns;
    intensityData = [];

    for (let i = 0; i < intensityDataLength; i++) {
      let r = pixelData[i*4];
      let g = pixelData[i*4+1];
      let b = pixelData[i*4+2];
      // ITU-R Rec BT.601
      intensityData[i] = Math.round(0.299*r + 0.587*g + 0.114*b);
    }

    return intensityData;
  }

  // Extract the various attributes we need
  return {
    imageId,
    minPixelValue: 0,
    maxPixelValue: 255,
    slope: 1,
    intercept: 0,
    windowCenter: 128,
    windowWidth: 255,
    render: external.cornerstone.renderWebImage,
    getPixelData,
    getIntensityData,
    getCanvas,
    getImage: () => image,
    rows,
    columns,
    height: rows,
    width: columns,
    color: true,
    rgba: false,
    columnPixelSpacing: undefined,
    rowPixelSpacing: undefined,
    invert: false,
    sizeInBytes: rows * columns * 4
  };
}
