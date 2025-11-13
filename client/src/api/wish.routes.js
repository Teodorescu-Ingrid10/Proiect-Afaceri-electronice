import axiosNoAuth from "../axios/axiosNoAuth";
import axiosAuth from "../axios/axiosAuth";

export const createWishlistItem = async (productId) => {
  try {
    const response = await axiosAuth.post("wishlist", { productId });
    return response.data;
  } catch (error) {
    console.error("Error creating wishlist item:", error);
    return error.response?.data;
  }
};

export const fetchWishlist = async () => {
  try {
    const response = await axiosAuth.get("wishlist");
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return error.response?.data;
  }
};

export const deleteWishlistItem = async (wishlistId) => {
  try {
    const response = await axiosAuth.delete(`wishlist/${wishlistId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    return error.response?.data;
  }
};

export const updateWishlistItem = async (wishlistId, body) => {
  try {
    const response = await axiosAuth.put(`wishlist/${wishlistId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error updating wishlist item:", error);
    return error.response?.data;
  }
};