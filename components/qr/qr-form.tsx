"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { generate_khqr } from "@/utils/qr-action";
import { SubmitButton } from "@/components/qr/submit-button";
import { FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Data = {
  currency: string;
  amount: string;
  merchantName: string;
  bakongAccountID: string;
  billNumber: string;
  mobileNumber: string;
};

export function QRForm() {
  const [data, setData] = useState<Data>({
    currency: "840",
    amount: "0",
    merchantName: "Suon Vansak",
    bakongAccountID: "suonvansak@bkrt",
    billNumber: "Bill-001",
    mobileNumber: "85511847089",
  });
  const [state, formAction] = useActionState(generate_khqr, null);
  const [img, setImg] = useState<string | null>("/image.png");

  const formChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const selectChange = (name: string, value: string) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const onBlur = () => {
    setData((prev) => {
      if (!prev.amount) return prev;

      let amountNum = Number(prev.amount);
      if (Number.isNaN(amountNum)) amountNum = 0;

      if (prev.currency === "116") {
        // KHR: round down to nearest 100
        amountNum = Math.floor(amountNum / 100) * 100;
      } else if (prev.currency === "840") {
        // USD: 2 decimals max
        amountNum = Math.round(amountNum * 100) / 100;
      }

      return { ...prev, amount: String(amountNum) };
    });
  };

  useEffect(() => {
    let objectUrl: string;

    const getImg = async () => {
      if (state?.qr) {
        const response = await fetch("/api/khqr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qr: state.qr }),
        });

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setImg(objectUrl);
      }
    };

    getImg();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [state?.qr]);

  return (
    <div className="mx-auto min-w-72 p-4 flex gap-4 border shadow-2xl rounded-2xl flex-col-reverse md:flex-row">
      <div className="w-full md:w-80">
        <form action={formAction} className="flex flex-col gap-4">
          <FieldLegend className="text-center">Payment</FieldLegend>
          <div className="space-y-2">
            <Select
              name="bakongAccountID"
              value={data.bakongAccountID}
              onValueChange={(value) => selectChange("bakongAccountID", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Account ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Account ID</SelectLabel>
                  <SelectItem value="suonvansak@bkrt">BAKONG</SelectItem>
                  <SelectItem value="suonvansak@aclb">ACLEDA</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Select
              name="currency"
              value={data.currency}
              onValueChange={(value) => selectChange("currency", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Currency</SelectLabel>
                  <SelectItem value="840">USD</SelectItem>
                  <SelectItem value="116">KHR</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              name="amount"
              type="number"
              value={data.amount}
              onChange={formChange}
              onBlur={onBlur}
              min={0}
              step={data.currency === "840" ? 0.01 : 100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="merchantName">Name</Label>
            <Input
              name="merchantName"
              id="merchantName"
              value={data.merchantName}
              onChange={formChange}
              placeholder="Merchant Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billNumber">Bill Number</Label>
            <Input
              name="billNumber"
              id="billNumber"
              value={data.billNumber}
              onChange={formChange}
              placeholder="Bill Number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input
              name="mobileNumber"
              id="mobileNumber"
              value={data.mobileNumber}
              onChange={formChange}
              placeholder="Mobile Number"
            />
          </div>
          <div className="flex justify-between">
            <SubmitButton hasState={!!state} />
          </div>
        </form>
      </div>
      <div className="w-full md:w-80 flex flex-col justify-center items-center">
        <div className="w-fit h-fit rounded-md overflow-hidden">
          {img && (
            <Image
              loading="eager"
              alt="KHQR"
              src={img}
              height={550}
              width={320}
              className="aspect-auto h-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
