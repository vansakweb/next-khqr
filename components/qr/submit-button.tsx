"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

export function SubmitButton({ hasState }: { hasState: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? "Loading..." : !hasState ? "Get KHQR" : "Update KHQR"}
    </Button>
  );
}
