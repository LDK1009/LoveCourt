import { create } from "zustand";

interface TemplateStortType {
  state: string;
  setState: (value: string) => void;
}

export const useTemplateStore = create<TemplateStortType>((set) => ({
  state: "",
  // option1
  setState: (value) =>
    set(() => ({
      state: value,
    })),
  // option2
  //   setState: (value) =>
  //     set((prev) => ({
  //       state: value,
  //     })),
}));
