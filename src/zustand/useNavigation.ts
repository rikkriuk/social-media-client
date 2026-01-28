import { create } from "zustand";

interface NavigationState {
   isNavigating: boolean;
   setIsNavigating: (value: boolean) => void;
}

const useNavigation = create<NavigationState>((set) => ({
   isNavigating: false,
   setIsNavigating: (value: boolean) => set({ isNavigating: value }),
}));

export default useNavigation;
