import { BakongKHQR, IndividualInfo } from "bakong-khqr";

const merchantInfo = {
  bakongAccountID: "suonvansak@bkrt",
  merchantName: "張榮禮",
  merchantCity: "Phnom Penh",
  accountInformation: undefined,
  acquiringBank: "BKRTKHPPXXX",
  currency: 840, // usd: 840, khr: 166
  amount: 0,
  billNumber: "#0001",
  storeLabel: "Web Dev Store",
  terminalLabel: "Web Dev",
  mobileNumber: "85511847089",
  purposeOfTransaction: "Testing KHQR",
  languagePreference: undefined,
  merchantNameAlternateLanguage: undefined,
  merchantCityAlternateLanguage: undefined,
  upiMerchantAccount: undefined,
  expirationTimestamp: Date.now() + 1 * 60 * 1000,
};
const khqr = new BakongKHQR();
export const response = khqr.generateIndividual(merchantInfo as IndividualInfo);
