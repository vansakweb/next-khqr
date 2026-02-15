import sharp from "sharp";
import QRCode from "qrcode";
import { bgMeta } from "@/app/api/khqr/route";
// Get dimensions of background and element to center
const qrResize = 580;
const logoSize = 120;
const borderSize = 12;
const totalSize = logoSize + borderSize * 2;
const radius = totalSize / 2;

export const getQrBuffer = async (
  qrText: string,
): Promise<Buffer<ArrayBufferLike>> => {
  return await QRCode.toBuffer(qrText, {
    errorCorrectionLevel: "H",
    margin: 0,
    color: { dark: "#000000", light: "#FFFFFF" },
    width: qrResize,
  });
};

export const getTextBuffer = (
  text: string,
  fontSize: number = 64,
  color: string = "black",
  anchor: string = "middle",
  width: number,
  height: number = 120,
) => {
  const x = anchor === "start" ? 156 : Math.floor(width / 2);
  const y = Math.floor((height + fontSize) / 2);
  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .t { font-family: Arial, sans-serif; font-weight: 700; font-size: ${fontSize}px; fill: ${color}; text-anchor: ${anchor}; }
    </style>
    <text x="${x}" y="${y}" class="t">${text}</text>
  </svg>`);
};

export const getlogoBuffer = async (
  logoPath: string,
): Promise<Buffer<ArrayBufferLike>> => {
  // Mask for rounded logo
  const maskSvg = `<svg width="${logoSize}" height="${logoSize}"><rect x="0" y="0" width="${logoSize}" height="${logoSize}" rx="${
    logoSize / 2
  }" ry="${logoSize / 2}"/></svg>`;

  // Create border circle
  const borderSvg = `<svg width="${totalSize}" height="${totalSize}">
    <circle cx="${radius}" cy="${radius}" r="${radius}" fill="${"#fff"}"/>
  </svg>`;

  // Create rounded logo
  const logo_crop = await sharp(logoPath)
    .resize(logoSize, logoSize, { fit: "cover" })
    .composite([{ input: Buffer.from(maskSvg), blend: "dest-in" }])
    .png()
    .toBuffer();

  // Composite border + logo
  return sharp(Buffer.from(borderSvg))
    .composite([{ input: logo_crop, top: borderSize, left: borderSize }])
    .png()
    .toBuffer();
};

export const getFinalImage = async (
  bgImage: sharp.Sharp,
  qrBuffer: Buffer<ArrayBufferLike>,
  logoBuffer: Buffer<ArrayBufferLike>,
  textBufferArr: {
    input: Buffer<ArrayBuffer>;
    left: number;
    top: number;
  }[],
): Promise<Buffer<ArrayBufferLike>> => {
  return await bgImage
    .composite([
      {
        input: qrBuffer,
        left: Math.floor(bgMeta.width - qrResize) / 2,
        top: Math.floor((bgMeta.height - qrResize) / 2 - 91),
      },
      {
        input: logoBuffer,
        left: Math.floor((bgMeta.width - totalSize) / 2),
        top: Math.floor((bgMeta.height - totalSize) / 2) - 91,
      },
      ...textBufferArr,
    ])
    .png()
    .toBuffer();
};
