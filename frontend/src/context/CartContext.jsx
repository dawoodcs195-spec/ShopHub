import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // ===============================
    // Cart Items
    // ===============================
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // ===============================
    // Shipping Address
    // ===============================
    const [shippingAddress, setShippingAddress] = useState(() => {
        const savedAddress = localStorage.getItem("shippingAddress");

        return savedAddress
            ? JSON.parse(savedAddress)
            : {
                  fullName: "",
                  phone: "",
                  address: "",
                  city: "",
                  postalCode: "",
                  country: "",
              };
    });

    // ===============================
    // Payment Method
    // ===============================
    const [paymentMethod, setPaymentMethod] = useState(() => {
        return (
            localStorage.getItem("paymentMethod") ||
            "Cash on Delivery"
        );
    });

    // ===============================
    // Applied Coupon
    // ===============================
    const [appliedCoupon, setAppliedCoupon] = useState(() => {
        const savedCoupon =
            localStorage.getItem("appliedCoupon");

        return savedCoupon
            ? JSON.parse(savedCoupon)
            : null;
    });

    // ===============================
    // Discount
    // ===============================
    const [discount, setDiscount] = useState(() => {
        return Number(
            localStorage.getItem("discount") || 0
        );
    });

    // ===============================
    // Save Cart
    // ===============================
    useEffect(() => {
        localStorage.setItem(
            "cart",
            JSON.stringify(cartItems)
        );
    }, [cartItems]);

    // ===============================
    // Save Shipping Address
    // ===============================
    useEffect(() => {
        localStorage.setItem(
            "shippingAddress",
            JSON.stringify(shippingAddress)
        );
    }, [shippingAddress]);

    // ===============================
    // Save Payment Method
    // ===============================
    useEffect(() => {
        localStorage.setItem(
            "paymentMethod",
            paymentMethod
        );
    }, [paymentMethod]);

    // ===============================
    // Save Coupon
    // ===============================
    useEffect(() => {
        if (appliedCoupon) {
            localStorage.setItem(
                "appliedCoupon",
                JSON.stringify(appliedCoupon)
            );
        } else {
            localStorage.removeItem(
                "appliedCoupon"
            );
        }
    }, [appliedCoupon]);

    // ===============================
    // Save Discount
    // ===============================
    useEffect(() => {
        localStorage.setItem(
            "discount",
            discount
        );
    }, [discount]);

    // ===============================
    // Add To Cart
    // ===============================
    const addToCart = (product) => {
        if (product.stock <= 0) {
            toast.error("Product is out of stock.");
            return;
        }

        setCartItems((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item._id === product._id
            );

            if (existingItem) {
                if (
                    existingItem.quantity >=
                    product.stock
                ) {
                    toast.error(
                        `Only ${product.stock} item(s) available in stock.`
                    );

                    return prevCart;
                }

                toast.success("Cart updated.");

                return prevCart.map((item) =>
                    item._id === product._id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity + 1,
                          }
                        : item
                );
            }

            toast.success(
                "Product added to cart."
            );

            return [
                ...prevCart,
                {
                    ...product,
                    quantity: 1,
                },
            ];
        });
    };

    // ===============================
    // Update Quantity
    // ===============================
    const updateQuantity = (id, quantity) => {
        setCartItems((prevCart) => {
            const product = prevCart.find(
                (item) => item._id === id
            );

            if (!product) return prevCart;

            if (quantity <= 0) {
                return prevCart.filter(
                    (item) => item._id !== id
                );
            }

            if (quantity > product.stock) {
                toast.error(
                    `Only ${product.stock} item(s) available in stock.`
                );

                return prevCart;
            }

            return prevCart.map((item) =>
                item._id === id
                    ? {
                          ...item,
                          quantity,
                      }
                    : item
            );
        });
    };

    // ===============================
    // Remove Item
    // ===============================
    const removeFromCart = (id) => {
        setCartItems((prevCart) =>
            prevCart.filter(
                (item) => item._id !== id
            )
        );

        toast.success(
            "Item removed from cart."
        );
    };

    // ===============================
    // Save Shipping Address
    // ===============================
    const saveShippingAddress = (
        address
    ) => {
        setShippingAddress(address);
    };

    // ===============================
    // Save Payment Method
    // ===============================
    const savePaymentMethod = (
        method
    ) => {
        setPaymentMethod(method);
    };

    // ===============================
    // Apply Coupon
    // ===============================
    const applyCoupon = (
        coupon,
        discountAmount
    ) => {
        setAppliedCoupon(coupon);
        setDiscount(discountAmount);

        toast.success(
            `Coupon "${coupon.code}" applied successfully.`
        );
    };

    // ===============================
    // Clear Coupon
    // ===============================
    const clearCoupon = () => {
        setAppliedCoupon(null);
        setDiscount(0);

        localStorage.removeItem(
            "appliedCoupon"
        );
        localStorage.removeItem(
            "discount"
        );
    };

    // ===============================
    // Clear Cart
    // ===============================
    const clearCart = () => {
        setCartItems([]);

        clearCoupon();

        localStorage.removeItem("cart");
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,

                shippingAddress,
                saveShippingAddress,

                paymentMethod,
                savePaymentMethod,

                appliedCoupon,
                discount,
                applyCoupon,
                clearCoupon,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () =>
    useContext(CartContext);