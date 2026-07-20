import { Link } from "react-router-dom";
import heroImage from "../../assets/images/hero.jpg";

const Hero = () => {
    return (
        <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-2xl overflow-hidden mb-10">
            <div className="max-w-7xl mx-auto px-8 py-16 grid lg:grid-cols-2 gap-10 items-center">

                <div>
                    <h1 className="text-5xl font-bold leading-tight">
                        Shop Smarter with ShopHub
                    </h1>

                    <p className="mt-6 text-lg text-blue-100">
                        Discover premium products at affordable prices.
                        Secure shopping, fast delivery, and the best shopping experience.
                    </p>

                    <Link
                        to="/"
                        className="inline-block mt-8 bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                        Shop Now
                    </Link>
                </div>

                <div className="flex justify-center">
                    <img
                        src={heroImage}
                        alt="Hero"
                        className="w-full max-w-lg rounded-xl shadow-2xl object-cover"
                    />
                </div>

            </div>
        </section>
    );
};

export default Hero;