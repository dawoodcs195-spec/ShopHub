import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");

        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem(
            "cart",
            JSON.stringify(cartItems)
        );
    }, [cartItems]);

    const addToCart = (product) => {

        const existingItem = cartItems.find(
            (item) => item._id === product._id
        );

        if (existingItem) {

            setCartItems(
                cartItems.map((item) =>
                    item._id === product._id
                        ? {
                              ...item,
                              quantity: item.quantity + 1,
                          }
                        : item
                )
            );

        } else {

            setCartItems([
                ...cartItems,
                {
                    ...product,
                    quantity: 1,
                },
            ]);

        }

    };

    const removeFromCart = (id) => {

        setCartItems(
            cartItems.filter(
                (item) => item._id !== id
            )
        );

    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);