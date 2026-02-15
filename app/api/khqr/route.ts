import fs from "fs";
import sharp from "sharp";
import { NextResponse } from "next/server";
import {
  getQrBuffer,
  getlogoBuffer,
  getTextBuffer,
  getFinalImage,
} from "@/utils/generate-khqr-img";
import { KHQR } from "ts-khqr";

export const bgPath = "assets/images/BKRTKHPPXXX.png";
export const logoPath = "assets/images/vansak.png";
export const bgImage = sharp(fs.readFileSync(bgPath));
export const bgMeta = await bgImage.metadata();

// export async function GET(request: Request) {
//   const {
//     currency,
//     amount,
//     name,
//     id,
//   }: { currency: number; amount: number; name: string; id: string } =
//     await request.json();

//   const { qr }: { qr: string } = await request.json();
//   const qrBuffer = await getQrBuffer(qr);
//   const logoBuffer = await getlogoBuffer(logoPath);
//   const textBuffer = getTextBuffer(name, 64, "black", "middle", bgMeta.width);
//   const textBufferArr = [
//     {
//       input: textBuffer,
//       left: 0,
//       top: 1360,
//     },
//   ];
//   const response = await getFinalImage(
//     bgImage,
//     qrBuffer,
//     logoBuffer,
//     textBufferArr,
//   );

//   return new NextResponse(Buffer.from(response), {
//     headers: {
//       "Content-Type": "image/png",
//       "Content-Disposition": "attachment; filename=khqr.png",
//     },
//   });
// }

export async function POST(request: Request) {
  const { qr }: { qr: string } = await request.json();
  const isKHQR = KHQR.verify(qr).isValid;
  if (!isKHQR) return;

  const result = KHQR.parse(qr);
  const name = String(result.data?.merchantName);

  const qrBuffer = await getQrBuffer(qr);
  const logoBuffer = await getlogoBuffer(logoPath);
  const textBuffer = getTextBuffer(name, 64, "black", "middle", bgMeta.width);
  const textBufferArr = [
    {
      input: textBuffer,
      left: 0,
      top: 1360,
    },
  ];
  const response = await getFinalImage(
    bgImage,
    qrBuffer,
    logoBuffer,
    textBufferArr,
  );

  return new NextResponse(Buffer.from(response), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": "attachment; filename=qr.png",
    },
  });
}
