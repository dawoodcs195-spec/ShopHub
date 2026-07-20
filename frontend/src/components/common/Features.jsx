import {
    FaTruck,
    FaShieldAlt,
    FaUndo,
    FaHeadset,
} from "react-icons/fa";

const features = [
    {
        icon: <FaTruck size={40} />,
        title: "Fast Delivery",
        description: "Quick and reliable shipping nationwide.",
    },
    {
        icon: <FaShieldAlt size={40} />,
        title: "Secure Payment",
        description: "100% secure payment methods.",
    },
    {
        icon: <FaUndo size={40} />,
        title: "Easy Returns",
        description: "Hassle-free return policy.",
    },
    {
        icon: <FaHeadset size={40} />,
        title: "24/7 Support",
        description: "Always here to help you.",
    },
];

const Features = () => {
    return (
        <section className="py-20">

            <h2 className="text-4xl font-bold text-center mb-12">
                Why Choose ShopHub?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg rounded-xl p-8 text-center hover:shadow-2xl transition"
                    >
                        <div className="text-blue-600 flex justify-center mb-5">
                            {feature.icon}
                        </div>

                        <h3 className="text-xl font-bold mb-3">
                            {feature.title}
                        </h3>

                        <p className="text-gray-600">
                            {feature.description}
                        </p>
                    </div>
                ))}

            </div>

        </section>
    );
};

export default Features;