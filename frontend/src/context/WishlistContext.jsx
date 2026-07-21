import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import toast from "react-hot-toast";

import { useAuth } from "./AuthContext";

import {
    getWishlist,
    toggleWishlist as toggleWishlistService,
} from "../services/wishlistService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { token, user } = useAuth();

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    // ===============================
    // Load Wishlist
    // ===============================
    const loadWishlist = async () => {
        if (!token || !user) {
            setWishlist([]);
            return;
        }

        try {
            setLoading(true);

            const data = await getWishlist(token);

            setWishlist(data);
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                    "Failed to load wishlist."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWishlist();
    }, [token, user]);

    // ===============================
    // Toggle Wishlist
    // ===============================
    const toggleWishlist = async (productId) => {
        if (!token) {
            toast.error("Please login to use your wishlist.");
            return;
        }

        try {
            const response = await toggleWishlistService(
                productId,
                token
            );

            await loadWishlist();

            toast.success(response.message);
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                    "Wishlist update failed."
            );
        }
    };

    // ===============================
    // Check Wishlist
    // ===============================
    const isInWishlist = (productId) => {
        return wishlist.some(
            (product) => product._id === productId
        );
    };

        return (
        <WishlistContext.Provider
            value={{
                wishlist,
                loading,
                loadWishlist,
                toggleWishlist,
                isInWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () =>
    useContext(WishlistContext);