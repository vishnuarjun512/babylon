import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  modelFileName: string;
  width: number;
  height: number;
  layout: string;
  setModelFileName: (value: string) => void;
  setWidth: (value: number) => void;
  setHeight: (value: number) => void;
  setLayout: (value: string) => void;
}

export const useModel = create<UserState>()(
  persist(
    (set) => ({
      modelFileName: "left",
      width: 1900,
      setModelFileName: (value) => {
        set({ modelFileName: value });
      },
      height: 2100,
      setHeight: (value) => {
        set({ height: value });
      },
      setWidth: (value) => {
        set({ width: value });
      },
      layout: "left",
      setLayout: (value) => {
        set({ layout: value });
      },
    }),
    {
      name: "modulo-model", // The name of the local storage key
    }
  )
);
