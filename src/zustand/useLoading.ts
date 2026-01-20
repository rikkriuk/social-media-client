import { create } from "zustand";

interface LoadingState {
   isLoading: boolean;
   loadingCount: number;
   startLoading: () => void;
   stopLoading: () => void;
   setLoading: (loading: boolean) => void;
}

const useLoading = create<LoadingState>((set) => ({
   isLoading: false,
   loadingCount: 0,
   startLoading: () =>
      set((state) => ({
         loadingCount: state.loadingCount + 1,
         isLoading: true,
      })),
   stopLoading: () =>
      set((state) => {
         const newCount = Math.max(0, state.loadingCount - 1);
         return {
            loadingCount: newCount,
            isLoading: newCount > 0,
         };
      }),
   setLoading: (loading: boolean) =>
      set({
         isLoading: loading,
         loadingCount: loading ? 1 : 0,
      }),
}));

export const startGlobalLoading = () => useLoading.getState().startLoading();
export const stopGlobalLoading = () => useLoading.getState().stopLoading();

export default useLoading;
