// niftiUtils.js
import * as nifti from "nifti-reader-js";

export function readNIFTI(name, data, drawCanvas) {
  const canvas = document.getElementById("myCanvas");
  const slider = document.getElementById("myRange");
  let niftiHeader, niftiImage;

  if (nifti.isCompressed(data)) {
    data = nifti.decompress(data);
  }

  if (nifti.isNIFTI(data)) {
    niftiHeader = nifti.readHeader(data);
    niftiImage = nifti.readImage(niftiHeader, data);
  }

  const slices = niftiHeader.dims[3];
  slider.max = slices - 1;
  slider.value = Math.round(slices / 2);
  slider.oninput = function () {
    drawCanvas(canvas, slider.value, niftiHeader, niftiImage);
  };

  drawCanvas(canvas, slider.value, niftiHeader, niftiImage);
}

export function drawCanvas(canvas, slice, niftiHeader, niftiImage) {
  const cols = niftiHeader.dims[1];
  const rows = niftiHeader.dims[2];

  canvas.width = cols;
  canvas.height = rows;

  const ctx = canvas.getContext("2d");
  const canvasImageData = ctx.createImageData(canvas.width, canvas.height);

  let typedData;

  switch (niftiHeader.datatypeCode) {
    case nifti.NIFTI1.TYPE_UINT8:
      typedData = new Uint8Array(niftiImage);
      break;
    case nifti.NIFTI1.TYPE_INT16:
      typedData = new Int16Array(niftiImage);
      break;
    case nifti.NIFTI1.TYPE_INT32:
      typedData = new Int32Array(niftiImage);
      break;
    case nifti.NIFTI1.TYPE_FLOAT32:
      typedData = new Float32Array(niftiImage);
      break;
    case nifti.NIFTI1.TYPE_FLOAT64:
      typedData = new Float64Array(niftiImage);
      break;
    case nifti.NIFTI1.TYPE_INT8:
      typedData = new Int8Array(niftiImage);
      break;
    case nifti.NIFTI1.TYPE_UINT16:
      typedData = new Uint16Array(niftiImage);
      break;
    case nifti.NIFTI1.TYPE_UINT32:
      typedData = new Uint32Array(niftiImage);
      break;
    default:
      return;
  }

  const sliceSize = cols * rows;
  const sliceOffset = sliceSize * slice;

  for (let row = 0; row < rows; row++) {
    const rowOffset = row * cols;

    for (let col = 0; col < cols; col++) {
      const offset = sliceOffset + rowOffset + col;
      const value = typedData[offset];

      canvasImageData.data[(rowOffset + col) * 4] = value & 0xff;
      canvasImageData.data[(rowOffset + col) * 4 + 1] = value & 0xff;
      canvasImageData.data[(rowOffset + col) * 4 + 2] = value & 0xff;
      canvasImageData.data[(rowOffset + col) * 4 + 3] = 0xff;
    }
  }

  ctx.putImageData(canvasImageData, 0, 0);
}

export function makeSlice(file, start, length) {
  if (typeof File === "undefined") {
    return function () {};
  }

  if (File.prototype.slice) {
    return file.slice(start, start + length);
  }

  return null;
}

export function readFile(file, readNIFTI, drawCanvas) {
  const blob = makeSlice(file, 0, file.size);

  const reader = new FileReader();

  reader.onloadend = function (evt) {
    if (evt.target.readyState === FileReader.DONE) {
      readNIFTI(file.name, evt.target.result, drawCanvas);
    }
  };

  reader.readAsArrayBuffer(blob);
}
