import { create } from "zustand";
import Cookies from "js-cookie";

export const useWishlistStore = create((set) => ({
  wishlist: [],

  // Ambil wishlist dari cookie
  loadWishlist: () => {
    try {
      const cookieWishlist = Cookies.get("wishlist");
      const parsed = cookieWishlist ? JSON.parse(cookieWishlist) : [];
      set({ wishlist: parsed });
    } catch (err) {
      console.error("Gagal baca wishlist dari cookie:", err);
      set({ wishlist: [] });
    }
  },

  // Toggle wishlist dan simpan ke cookie
  toggleWishlist: (productId) =>
    set((state) => {
      const exists = state.wishlist.some((item) => item.id === productId);
      let updated;

      if (exists) {
        updated = state.wishlist.filter((item) => item.id !== productId);
      } else {
        updated = [...state.wishlist, { id: productId }];
      }

      // Simpan ke cookie (berlaku selama 7 hari)
      Cookies.set("wishlist", JSON.stringify(updated), { expires: 7 });

      return { wishlist: updated };
    }),
}));
