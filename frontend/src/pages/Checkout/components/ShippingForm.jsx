const ShippingForm = ({
    fullName,
    setFullName,
    phone,
    setPhone,
    address,
    setAddress,
    city,
    setCity,
    postalCode,
    setPostalCode,
    country,
    setCountry,
}) => {
    return (
        <>
            <h2 className="text-2xl font-bold mb-4">
                Shipping Address
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) =>
                        setFullName(e.target.value)
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                />

                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) =>
                        setPhone(e.target.value)
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                />
            </div>

            <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) =>
                    setAddress(e.target.value)
                }
                className="border rounded-lg px-4 py-2 w-full"
            />

            <div className="grid md:grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) =>
                        setCity(e.target.value)
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                />

                <input
                    type="text"
                    placeholder="Postal Code"
                    value={postalCode}
                    onChange={(e) =>
                        setPostalCode(e.target.value)
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                />

                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) =>
                        setCountry(e.target.value)
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                />
            </div>
        </>
    );
};

export default ShippingForm;