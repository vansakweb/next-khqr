"use server";
import { KHQR, COUNTRY, TAG } from "ts-khqr";

export async function generateKHQR(_: unknown, formData: FormData) {
  const currency = String(formData.get("currency"));
  const amount = Number(formData.get("amount") || 0);
  const merchantName = String(formData.get("name"));
  const accountID = String(formData.get("id"));

  const result = KHQR.generate({
    tag: TAG.INDIVIDUAL, // TAG.MERCHANT
    accountID,
    merchantName,
    // optional
    merchantID: "011847089",
    acquiringBank: "Dev Bank",
    merchantCity: "Phnom Penh", // default 'Phnom Penh'
    currency, // CURRENCY.KHR, // default KHR
    amount, // default 0
    countryCode: COUNTRY.KH, // default KH
    merchantCategoryCode: "5999", // default "5999"
    expirationTimestamp: Date.now() + 1 * 60 * 1000, // required if amount is not null or zero (eg. expired in 1 minutes)
    additionalData: {
      mobileNumber: "85511847089",
      billNumber: "INV-2026-02-04",
      storeLabel: "Coffe Shop",
      terminalLabel: "012345678",
      purposeOfTransaction: "Payment",
    },
  });

  return result.data;
}

export async function verifyKHQR(_: unknown, formData: FormData) {
  const khqrString = String(formData.get("qr"));
  const isKHQR = KHQR.verify(khqrString).isValid;

  return isKHQR;
}

export async function parseKHQR(_: unknown, formData: FormData) {
  const khqrString = String(formData.get("qr"));
  const result = KHQR.parse(khqrString);

  return result;
}
