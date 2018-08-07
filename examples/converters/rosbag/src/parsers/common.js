/* global Buffer */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {encodeBinaryXVIZ, parseBinaryXVIZ} = require('@xviz/client');

function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    // make sure parent exists
    const parent = path.dirname(dirPath);
    createDir(parent);

    fs.mkdirSync(dirPath);
  }
}

function deleteDirRecursive(parentDir) {
  const files = fs.readdirSync(parentDir);
  files.forEach(file => {
    const currPath = path.join(parentDir, file);
    if (fs.lstatSync(currPath).isDirectory()) {
      // recurse
      deleteDirRecursive(currPath);
    } else {
      // delete file
      fs.unlinkSync(currPath);
    }
  });

  fs.rmdirSync(parentDir);
}

function toBuffer(ab) {
  assert(ab instanceof ArrayBuffer);
  const buf = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}

function toArrayBuffer(buf) {
  assert(buf instanceof Buffer);
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

function packGLB(filePath, inputJson, options = {flattenArrays: false}) {
  const glbFileBuffer = encodeBinaryXVIZ(inputJson, options);
  fs.writeFileSync(`${filePath}.glb`, toBuffer(glbFileBuffer), {flag: 'w'});
  console.log(`Wrote ${filePath}.glb`); // eslint-disable-line
}

function unpackGLB(filePath) {
  const buffer = fs.readFileSync(`${filePath}.glb`);
  const parsed = parseBinaryXVIZ(toArrayBuffer(buffer));
  return parsed;
}

module.exports = {
  createDir,
  deleteDirRecursive,
  packGLB,
  toArrayBuffer,
  unpackGLB,
  toBuffer
};
