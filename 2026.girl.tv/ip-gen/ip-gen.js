"use strict";

/*
IPv4 -> ASCII pixel face
Fixed slots, maintenance-friendly structure.

Mapping:
Octet 1: eyebrows / eyes / pupils
Octet 2: upper lids / lower lids / eyelashes
Octet 3: nose length / nostrils / ears
Octet 4: mouth width / mouth opening / mouth curve
*/

const ON = "█";
const OFF = "░";

function createGrid(width, height, fill = OFF) {
  return Array.from({ length: height }, () => Array(width).fill(fill));
}

function drawPattern(grid, x, y, pattern) {
  for (let row = 0; row < pattern.length; row += 1) {
    for (let col = 0; col < pattern[row].length; col += 1) {
      const gx = x + col;
      const gy = y + row;
      if (
        gy >= 0 &&
        gy < grid.length &&
        gx >= 0 &&
        gx < grid[0].length &&
        pattern[row][col] === ON
      ) {
        grid[gy][gx] = ON;
      }
    }
  }
}

function mirrorPattern(pattern) {
  return pattern.map((row) => row.split("").reverse().join(""));
}

function gridToString(grid) {
  return grid.map((row) => row.join("")).join("\n");
}

function parseIPv4(ip) {
  const parts = ip.split(".");
  if (parts.length !== 4) {
    throw new Error("IPv4 must contain exactly 4 octets.");
  }

  const octets = parts.map((p) => {
    if (!/^\d+$/.test(p)) {
      throw new Error(`Invalid octet: ${p}`);
    }
    const n = Number(p);
    if (!Number.isInteger(n) || n < 0 || n > 255) {
      throw new Error(`Octet out of range: ${p}`);
    }
    return n;
  });

  return octets;
}

function octetsToDigits(octets) {
  return octets.map((n) => String(n).padStart(3, "0").split("").map(Number));
}

/*
Face coordinate system
width: 33
height: 19

Slots:
- eyebrows left/right
- upper lids left/right
- eyes left/right
- lower lids left/right
- eyelashes left/right
- ears left/right
- nose center
- mouth center
*/

const FACE_LAYOUT = {
  width: 33,
  height: 19,

  leftEyebrow: { x: 5, y: 2 },
  rightEyebrow: { x: 22, y: 2 },

  leftUpperLid: { x: 6, y: 4 },
  rightUpperLid: { x: 23, y: 4 },

  leftEye: { x: 6, y: 5 },
  rightEye: { x: 23, y: 5 },

  leftLowerLid: { x: 6, y: 8 },
  rightLowerLid: { x: 23, y: 8 },

  leftEyelashes: { x: 6, y: 3 },
  rightEyelashes: { x: 23, y: 3 },

  nose: { x: 15, y: 8 },
  earsLeft: { x: 2, y: 7 },
  earsRight: { x: 29, y: 7 },

  mouth: { x: 10, y: 13 }
};

// ---------- VARIANT TABLES ----------

// 0-9: eyebrows
const EYEBROWS = [
  ["██████"],            // 0 flat
  [" ████ "],            // 1 short
  ["█████░"],            // 2 heavier inner
  ["░█████"],            // 3 heavier outer
  ["  ████", " ████ "],  // 4 rising
  ["████  ", " ████ "],  // 5 falling
  ["██░███"],            // 6 broken
  ["█░░░██"],            // 7 split
  ["██████", "██████"],  // 8 thick
  ["███░██"]             // 9 center break
];

// 0-9: eye shapes (without pupils)
const EYES = [
  ["███████", "█░░░░░█", "███████"], // 0 square
  ["░█████░", "█░░░░░█", "░█████░"], // 1 rounded
  ["███████", "░░░░░░░", "███████"], // 2 slit
  ["░█████░", "░░░░░░░", "░█████░"], // 3 soft slit
  ["██░░░██", "█░░░░░█", "██░░░██"], // 4 wide corners
  ["░██░██░", "█░░░░░█", "░██░██░"], // 5 segmented
  ["███████", "█░█░█░█", "███████"], // 6 gridded
  ["░█████░", "█░█░█░█", "░█████░"], // 7 rounded segmented
  ["███░███", "█░░░░░█", "███░███"], // 8 center pinch
  ["███████", "█░░█░░█", "███████"]  // 9 inner split
];

// 0-9: pupil positions / styles, placed inside 7-wide eye row
const PUPILS = [
  "░░░█░░░", // 0 center
  "█░░░░░░", // 1 far left
  "░█░░░░░", // 2 left
  "░░█░░░░", // 3 center-left
  "░░░░█░░", // 4 center-right
  "░░░░░█░", // 5 right
  "░░░░░░█", // 6 far right
  "█░░█░░█", // 7 triple
  "░█░█░█░", // 8 rhythm
  "███████"  // 9 fully dark
];

// 0-9: upper lids
const UPPER_LIDS = [
  ["███████"],
  ["░█████░"],
  ["███░███"],
  ["██░░░██"],
  ["█░░░░░█"],
  ["████░░░"],
  ["░░░████"],
  ["███░░░░"],
  ["░░░░███"],
  ["███████", "░░░░░░░"]
];

// 0-9: lower lids
const LOWER_LIDS = [
  ["███████"],
  ["░█████░"],
  ["███░███"],
  ["██░░░██"],
  ["█░░░░░█"],
  ["░░░████"],
  ["████░░░"],
  ["░░███░░"],
  ["██░░░░█"],
  ["███████", "███████"]
];

// 0-9: eyelashes (single line per eye)
const EYELASHES = [
  ["░░░░░░░"],
  ["█░░░░░█"],
  ["█░█░█░█"],
  ["██░░░██"],
  ["░█░█░█░"],
  ["███████"],
  ["███░███"],
  ["█░███░█"],
  ["███░░██"],
  ["█░█░░█░"]
];

// 0-9: nose length
const NOSE_LENGTHS = [
  ["█", "█"],
  ["█", "█", "█"],
  ["█", "█", "█", "█"],
  ["█", "█", "█", "█", "█"],
  ["█", "█", "█", "█", "█", "█"],
  ["█", "█", "█", "█", "█", "█", "█"],
  ["█", "█", "█", "█", "█", "█", "█", "█"],
  ["█", "█", "█", "█", "█", "█", "█", "█", "█"],
  ["█", "█", "█", "█", "█", "█", "█", "█", "█", "█"],
  ["█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█"]
];

// 0-9: nose base / nostrils
const NOSTRILS = [
  ["░█░"],        // 0 tiny base
  ["█░█"],        // 1 classic
  ["███"],        // 2 filled
  ["█░░█"],       // 3 wide
  ["██░██"],      // 4 heavier nostrils
  ["█░█", "░█░"], // 5 base + tip
  ["░█░", "█░█"], // 6 tip + base
  ["██", "██"],   // 7 square
  ["█░█", "█░█"], // 8 stacked
  ["███", "███"]  // 9 full
];

// 0-9: ears
const EARS = [
  ["██", "██"],
  ["███", "███"],
  ["█░█", "███"],
  ["███", "█░█"],
  ["█", "█", "█"],
  ["██", "█░", "██"],
  ["░█", "██", "░█"],
  ["███", "█░█", "███"],
  ["████", "████"],
  ["█░█", "█░█", "█░█"]
];

// 0-9: mouth width (base template width)
const MOUTH_WIDTHS = [
  ["███████", "█░░░░░█", "███████"],
  ["█████████", "█░░░░░░░█", "█████████"],
  ["███████████", "█░░░░░░░░░█", "███████████"],
  ["█████████████", "█░░░░░░░░░░░█", "█████████████"],
  ["███████████████", "█░░░░░░░░░░░░░█", "███████████████"],
  ["█████████", "█░░█░█░░█", "█████████"],
  ["███████████", "█░█░░░░░█░█", "███████████"],
  ["█████████████", "█░░█░░░█░░█", "█████████████"],
  ["███████████", "█░░░█░█░░░█", "███████████"],
  ["█████████████", "█░█░█░█░█░█", "█████████████"]
];

// 0-9: mouth opening (modifies center line)
const MOUTH_OPENINGS = [
  "░░░",          // 0 closed
  "███",          // 1 dark small
  "█████",        // 2 dark medium
  "███████",      // 3 dark wide
  "█░█",          // 4 split
  "█░░█",         // 5 small oval
  "██░██",        // 6 teeth-like
  "░█░█░",        // 7 rhythmic
  "█░█░█",        // 8 segmented
  "█████████"     // 9 huge
];

// 0-9: mouth curve
const MOUTH_CURVES = [
  ["░█████████░"], // 0 neutral
  ["░░███████░░"], // 1 slight smile
  ["░░░█████░░░"], // 2 strong smile
  ["███████████"], // 3 flat broad
  ["██░░░░░░░██"], // 4 corners down
  ["░█░░░░░░░█░"], // 5 tight
  ["█░███████░█"], // 6 curl
  ["███░░░░░███"], // 7 frown
  ["░████░████░"], // 8 asymmetric feel
  ["████░░░████"]  // 9 broad split
];

// ---------- RENDER HELPERS ----------

function overlayEyeWithPupil(eyePattern, pupilRow) {
  const out = eyePattern.map((row) => row.split(""));
  const targetRow = 1; // middle row of 3-row eye
  for (let i = 0; i < Math.min(out[targetRow].length, pupilRow.length); i += 1) {
    if (pupilRow[i] === ON) {
      out[targetRow][i] = ON;
    }
  }
  return out.map((row) => row.join(""));
}

function centerPatternWidth(pattern, width) {
  return pattern.map((row) => {
    if (row.length >= width) return row;
    const totalPad = width - row.length;
    const left = Math.floor(totalPad / 2);
    const right = totalPad - left;
    return OFF.repeat(left) + row + OFF.repeat(right);
  });
}

function buildMouth(widthVariant, openingVariant, curveVariant) {
  const base = [...widthVariant];
  const w = base[1].length;

  let openRow = centerPatternWidth([openingVariant], w)[0];
  let curveRow = centerPatternWidth(curveVariant, w)[0];

  // Put opening into middle row by overwriting dark pixels
  const middle = base[1].split("");
  for (let i = 0; i < openRow.length; i += 1) {
    if (openRow[i] === ON) {
      middle[i] = ON;
    }
  }

  return [base[0], middle.join(""), curveRow];
}

function buildFaceFromIPv4(ip) {
  const octets = parseIPv4(ip);
  const digits = octetsToDigits(octets);

  const [
    [browsDigit, eyesDigit, pupilsDigit],
    [upperLidDigit, lowerLidDigit, lashesDigit],
    [noseLenDigit, nostrilDigit, earsDigit],
    [mouthWidthDigit, mouthOpenDigit, mouthCurveDigit]
  ] = digits;

  const grid = createGrid(FACE_LAYOUT.width, FACE_LAYOUT.height, OFF);

  // ears
  drawPattern(grid, FACE_LAYOUT.earsLeft.x, FACE_LAYOUT.earsLeft.y, EARS[earsDigit]);
  drawPattern(grid, FACE_LAYOUT.earsRight.x, FACE_LAYOUT.earsRight.y, mirrorPattern(EARS[earsDigit]));

  // eyebrows
  drawPattern(grid, FACE_LAYOUT.leftEyebrow.x, FACE_LAYOUT.leftEyebrow.y, EYEBROWS[browsDigit]);
  drawPattern(grid, FACE_LAYOUT.rightEyebrow.x, FACE_LAYOUT.rightEyebrow.y, mirrorPattern(EYEBROWS[browsDigit]));

  // eyelashes
  drawPattern(grid, FACE_LAYOUT.leftEyelashes.x, FACE_LAYOUT.leftEyelashes.y, EYELASHES[lashesDigit]);
  drawPattern(grid, FACE_LAYOUT.rightEyelashes.x, FACE_LAYOUT.rightEyelashes.y, mirrorPattern(EYELASHES[lashesDigit]));

  // lids
  drawPattern(grid, FACE_LAYOUT.leftUpperLid.x, FACE_LAYOUT.leftUpperLid.y, UPPER_LIDS[upperLidDigit]);
  drawPattern(grid, FACE_LAYOUT.rightUpperLid.x, FACE_LAYOUT.rightUpperLid.y, mirrorPattern(UPPER_LIDS[upperLidDigit]));

  drawPattern(grid, FACE_LAYOUT.leftLowerLid.x, FACE_LAYOUT.leftLowerLid.y, LOWER_LIDS[lowerLidDigit]);
  drawPattern(grid, FACE_LAYOUT.rightLowerLid.x, FACE_LAYOUT.rightLowerLid.y, mirrorPattern(LOWER_LIDS[lowerLidDigit]));

  // eyes + pupils
  const leftEye = overlayEyeWithPupil(EYES[eyesDigit], PUPILS[pupilsDigit]);
  const rightEye = mirrorPattern(leftEye);

  drawPattern(grid, FACE_LAYOUT.leftEye.x, FACE_LAYOUT.leftEye.y, leftEye);
  drawPattern(grid, FACE_LAYOUT.rightEye.x, FACE_LAYOUT.rightEye.y, rightEye);

  // nose
  drawPattern(grid, FACE_LAYOUT.nose.x, FACE_LAYOUT.nose.y, NOSE_LENGTHS[noseLenDigit]);
  drawPattern(grid, FACE_LAYOUT.nose.x - 1, FACE_LAYOUT.nose.y + NOSE_LENGTHS[noseLenDigit].length, NOSTRILS[nostrilDigit]);

  // mouth
  const mouth = buildMouth(
    MOUTH_WIDTHS[mouthWidthDigit],
    MOUTH_OPENINGS[mouthOpenDigit],
    MOUTH_CURVES[mouthCurveDigit]
  );
  const mouthWidth = mouth[0].length;
  const mouthX = Math.floor((FACE_LAYOUT.width - mouthWidth) / 2);
  drawPattern(grid, mouthX, FACE_LAYOUT.mouth.y, mouth);

  return gridToString(grid);
}

// ---------- DEMO ----------

const examples = [
  "192.168.0.1",
  "100.100.100.100",
  "255.255.255.255",
  "8.8.8.8",
  "127.0.0.1"
];

for (const ip of examples) {
  console.log(`\nIP: ${ip}\n`);
  console.log(buildFaceFromIPv4(ip));
}