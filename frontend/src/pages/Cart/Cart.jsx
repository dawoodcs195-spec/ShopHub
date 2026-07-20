import { useCart } from "../../context/CartContext";

const Cart = () => {
    const { cartItems, removeFromCart } = useCart();

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    if (cartItems.length === 0) {
        return (
            <div className="max-w-6xl mx-auto py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Your Cart is Empty
                </h1>

                <p className="text-gray-500">
                    Add some products to your cart.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-5">

            <h1 className="text-4xl font-bold mb-10">
                Shopping Cart
            </h1>

            <div className="grid lg:grid-cols-3 gap-10">

                {/* Cart Items */}

                <div className="lg:col-span-2 space-y-5">

                    {cartItems.map((item) => (

                        <div
                            key={item._id}
                            className="flex items-center gap-5 bg-white rounded-xl shadow-md p-5"
                        >

                            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                Image
                            </div>

                            <div className="flex-1">

                                <h2 className="text-xl font-bold">
                                    {item.name}
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    {item.description}
                                </p>

                                <p className="text-blue-600 font-bold mt-2">
                                    Rs. {item.price}
                                </p>

                                <p className="mt-2">
                                    Quantity: {item.quantity}
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    removeFromCart(item._id)
                                }
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                                Remove
                            </button>

                        </div>

                    ))}

                </div>

                {/* Order Summary */}

                <div className="bg-white rounded-xl shadow-md p-6 h-fit">

                    <h2 className="text-2xl font-bold mb-6">
                        Order Summary
                    </h2>

                    <div className="flex justify-between mb-4">
                        <span>Total Items</span>

                        <span>{cartItems.length}</span>
                    </div>

                    <div className="flex justify-between mb-6">
                        <span>Total Price</span>

                        <span className="font-bold text-blue-600">
                            Rs. {totalPrice}
                        </span>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                        Proceed to Checkout
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Cart;