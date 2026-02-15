import { QRForm } from "@/components/qr/qr-form";
import { AngkorBG } from "@/components/angkor-bg";

export default async function KHQRPage() {
  return (
    <main className="mx-auto p-4 flex-1 flex w-full max-w-3xl flex-col items-center justify-between sm:items-start">
      <QRForm />
      <AngkorBG />
      <div />
    </main>
  );
}

// Sou Cheyneath 21
