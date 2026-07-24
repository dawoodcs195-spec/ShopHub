import { Link } from "react-router-dom";
import {
    FaInstagram,
    FaWhatsapp,
    FaHeart,
    FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden bg-[#2D2A26] text-white">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />

                <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20">
                <div className="grid gap-14 lg:grid-cols-4">
                    <div>
                        <h2 className="font-serif text-4xl font-bold tracking-tight">
                            ShopHub
                        </h2>

                        <p className="mt-6 leading-8 text-[#DDD5CF]">
                            A home for handcrafted candles, resin
                            creations, personalized gifts, and
                            beautiful keepsakes made with passion,
                            creativity, and love.
                        </p>

                        <div className="mt-8 flex items-center gap-4">
                            <motion.a
                                whileHover={{
                                    y: -3,
                                }}
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#B76E79]"
                            >
                                <FaInstagram />
                            </motion.a>

                            <motion.a
                                whileHover={{
                                    y: -3,
                                }}
                                href="https://wa.me/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#B76E79]"
                            >
                                <FaWhatsapp />
                            </motion.a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-serif text-2xl font-semibold">
                            Explore
                        </h3>

                        <ul className="mt-6 space-y-4 text-[#DDD5CF]">
                            <li>
                                <Link
                                    to="/"
                                    className="transition-colors hover:text-white"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/wishlist"
                                    className="transition-colors hover:text-white"
                                >
                                    Wishlist
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/cart"
                                    className="transition-colors hover:text-white"
                                >
                                    Shopping Cart
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/profile"
                                    className="transition-colors hover:text-white"
                                >
                                    My Profile
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-serif text-2xl font-semibold">
                            Collections
                        </h3>

                        <ul className="mt-6 space-y-4 text-[#DDD5CF]">
                            <li>Handcrafted Candles</li>
                            <li>Resin Art</li>
                            <li>Personalized Gifts</li>
                            <li>Home Décor</li>
                            <li>Jewelry & Accessories</li>
                        </ul>
                    </div>

                    <div className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                        <h3 className="font-serif text-2xl font-semibold">
                            Looking for Something Unique?
                        </h3>

                        <p className="mt-5 leading-8 text-[#DDD5CF]">
                            We love creating custom handmade
                            pieces designed especially for you.
                            Share your idea and let's create
                            something beautiful together.
                        </p>

                        <a
                            href="https://wa.me/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 inline-flex items-center gap-3 font-semibold text-[#E7C27D] transition-all hover:gap-5"
                        >
                            Request a Custom Order

                            <FaArrowRight />
                        </a>
                    </div>
                </div>

                <div className="my-14 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-[#C9C0B9] md:flex-row">
                    <p>
                        © {currentYear} ShopHub. All Rights
                        Reserved.
                    </p>

                    <p className="flex items-center gap-2">
                        Handcrafted with

                        <FaHeart className="text-[#B76E79]" />

                        for every beautiful moment.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;