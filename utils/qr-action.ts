"use server";

import { BakongKHQR, IndividualInfo } from "bakong-khqr";

export async function generate_khqr(_: unknown, formData: FormData) {
  const bakongAccountID = String(formData.get("bakongAccountID"));
  const merchantName = String(formData.get("merchantName"));
  const currency = Number(formData.get("currency"));
  const amount = Number(formData.get("amount") || 0);
  const billNumber = String(formData.get("billNumber"));
  const mobileNumber = String(formData.get("mobileNumber"));

  const merchantInfo = {
    bakongAccountID,
    merchantName,
    merchantCity: "Phnom Penh",
    accountInformation: undefined,
    acquiringBank: "BKRTKHPPXXX",
    currency, // usd: 840, khr: 166 //khqrData.currency.khr,
    amount,
    billNumber,
    storeLabel: "Web Dev Store",
    terminalLabel: "Web Dev",
    mobileNumber,
    purposeOfTransaction: "Testing KHQR",
    languagePreference: undefined,
    merchantNameAlternateLanguage: undefined,
    merchantCityAlternateLanguage: undefined,
    upiMerchantAccount: undefined,
    expirationTimestamp: Date.now() + 1 * 60 * 1000, // required if amount is not null or zero (eg. expired in 1 minutes)
  };

  const khqr = new BakongKHQR();
  const response = khqr.generateIndividual(merchantInfo as IndividualInfo);

  return response.data as { qr: string; md5: string } | null;
}

export const check_payment = async (_: unknown, formData: FormData) => {
  const md5 = String(formData.get("md5"));

  const uri = "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5";
  const res = await fetch(uri, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ md5 }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data;
};
