import { create } from "zustand";
import { combine } from "zustand/middleware";

type Khqr = {
  qr: string;
  md5: string;
};

export const useKhqrStore = create(
  combine(
    {
      khqr: null as Khqr | null,
    },
    (set) => ({
      setKhqr: (khqr: Khqr) => set({ khqr }),
      updateKhqr: (khqr: Khqr) => set({ khqr: { ...khqr } }),
    })
  )
);
