import { mmkvStorage } from "@/lib";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createSelectors } from "../store-utils";

interface TUtility {
  hapticFeedback: boolean;
  setHapticFeedback: (value: boolean) => void;
  sizeScale: number;
  setSizeScale: (value: number) => void;
}

const _useUtility = create<TUtility>()(
  devtools(
    persist(
      (set) => ({
        hapticFeedback: true,
        sizeScale: 1,
        setHapticFeedback: (value: boolean) => {
          set({ hapticFeedback: value });
        },
        setSizeScale: (value: number) => {
          set({ sizeScale: value });
        },
      }),
      {
        name: "utilityState",
        storage: createJSONStorage(() => mmkvStorage),
      },
    ),
  ),
);
export const UtilitySelector = (state: TUtility) => state;

export const useUtility = createSelectors(_useUtility);

export const setHapticFeedback = (value: boolean) => _useUtility.getState().setHapticFeedback(value);

export const setSizeScale = (value: number) => _useUtility.getState().setSizeScale(value);
