"use client";
import { useActionState, useEffect, useState } from "react";
import { FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateKHQR } from "@/utils/qr-action";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { check_payment } from "@/lib/check_payment";

type Data = { currency: string; amount: string; name: string; id: string };

export function QRForm() {
  const [data, setData] = useState<Data>({
    currency: "840",
    amount: "0",
    name: "Suon Vansak",
    id: "suonvansak@kbrt",
  });
  const step = data.currency === "840" ? "0.01" : "100";
  const { pending } = useFormStatus();
  const [state, formAction] = useActionState(generateKHQR, null);
  const [img, setImg] = useState<string | null>("/image.png");
  const [payment, setPayment] = useState(null);

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

  const getImg = async (): Promise<void> => {
    if (state?.qr) {
      const response = await fetch("https://next-khqr.vercel.app/api/khqr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qr: state.qr }),
      });
      const blob = await response.blob();
      const dataUrl = URL.createObjectURL(blob);
      setImg(dataUrl);
    }
  };
  const checkPayment = async () => {
    if (state?.md5) {
      const pay = await check_payment(state.md5);
      setPayment(pay);
    }
  };
  useEffect(() => {
    if (state?.qr) {
      getImg();
    }
  }, [state?.qr]);

  console.log(payment);
  return (
    <div className="w-full p-4 flex gap-2 border shadow-2xl rounded-2xl justify-between flex-col-reverse md:flex-row">
      <div className="md:w-80 md:p-4">
        <form action={formAction} className="flex flex-col gap-4">
          <FieldLegend className="text-center">Payment</FieldLegend>
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
              step={step}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              id="name"
              value={data.name}
              onChange={formChange}
              placeholder="Name"
            />
          </div>
          <div className="space-y-2 sr-only">
            <Label htmlFor="id">Bakong Account ID</Label>
            <Input
              name="id"
              id="id"
              value={data.id}
              onChange={formChange}
              placeholder="Bakong Account ID"
            />
          </div>
          <div className="flex justify-between">
            <Button disabled={pending} type="submit">
              {!state ? "Get KHQR" : "Update KHQR"}
            </Button>
            {state?.md5 && (
              <Button type="button" onClick={checkPayment}>
                Check Payment
              </Button>
            )}
          </div>
          <div>
            {/* <p>{payment && payment?.responseCode == 0 && "OK"}</p> */}
          </div>
        </form>
      </div>
      <div className="overflow-hidden md:w-80 rounded opacity-100">
        <div>
          {img && (
            <Image
              loading="eager"
              alt="KHQR"
              src={img}
              height={550}
              width={320}
              className="aspect-auto w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
