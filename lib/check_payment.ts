"use server";
// type KhqrRespon = {
//   responseCode: number;
//   responseMessage: string;
//   errorCode: number | null;
//   data: {
//     hash: string;
//     fromAccountId: string;
//     toAccountId: string;
//     currency: "KHR" | "USD";
//     amount: number;
//     description: null | string;
//     createdDateMs: Date;
//     acknowledgedDateMs: Date;
//     trackingStatus: null | string;
//     receiverBank: null | string;
//     receiverBankAccount: null | string;
//     instructionRef: null | string;
//     externalRef: null | string;
//   };
// };

const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNDViMDM0NDZmYjA2NGQyMSJ9LCJpYXQiOjE3NjcwMjczOTUsImV4cCI6MTc3NDgwMzM5NX0.hlT7703QemkucjgSMhy-6MOluoupKoz0jbqorYb7SBM";
const uri = "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5";

export const check_payment = async (md5: string) => {
  const res = await fetch(uri, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
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
