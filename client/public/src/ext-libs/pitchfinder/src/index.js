const AMDF = require("./detectors/amdf");
const YIN = require("./detectors/yin");
const DynamicWavelet = require("./detectors/dynamic_wavelet");

const frequencies = require("./tools/frequencies");

module.exports = {
  AMDF,
  YIN,
  DynamicWavelet,

  frequencies,
};