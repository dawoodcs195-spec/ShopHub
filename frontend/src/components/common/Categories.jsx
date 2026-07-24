import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaFire,
    FaRegGem,
    FaHeart,
    FaGift,
    FaLeaf,
    FaStar,
} from "react-icons/fa";

import Reveal from "./Reveal";

const categories = [
    {
        name: "Signature Candles",
        description:
            "Hand-poured candles crafted to bring warmth and comfort to every space.",
        icon: FaFire,
        slug: "candles",
    },
    {
        name: "Resin Art",
        description:
            "Unique handcrafted resin creations inspired by nature and elegance.",
        icon: FaRegGem,
        slug: "resin",
    },
    {
        name: "Floral Collection",
        description:
            "Delicate floral designs made to celebrate beauty in every season.",
        icon: FaLeaf,
        slug: "floral",
    },
    {
        name: "Personalized Gifts",
        description:
            "Thoughtful keepsakes created especially for your loved ones.",
        icon: FaGift,
        slug: "gifts",
    },
    {
        name: "Handmade Accessories",
        description:
            "Beautiful handcrafted pieces designed to complete every occasion.",
        icon: FaStar,
        slug: "accessories",
    },
    {
        name: "Best Sellers",
        description:
            "Discover the creations our customers fall in love with the most.",
        icon: FaHeart,
        slug: "best-sellers",
    },
];

const containerVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

const Categories = () => {
    return (
        <section className="bg-[#FCFAF7] py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <Reveal
                    y={24}
                    duration={0.85}
                    className="max-w-2xl mx-auto text-center mb-16"
                >
                    <span className="inline-block rounded-full bg-rose-100 px-5 py-2 text-sm font-semibold tracking-wide text-rose-700">
                        Our Collections
                    </span>

                    <h2 className="mt-6 text-4xl lg:text-5xl font-serif font-bold text-[#2D2A26]">
                        Crafted for Every
                        <br />
                        Beautiful Moment
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-[#6B655F]">
                        Explore thoughtfully handcrafted creations designed
                        with care, creativity, and timeless elegance.
                    </p>
                </Reveal>

                <Reveal
                    variants={containerVariants}
                    className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
                >
                    {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <motion.div
                                key={category.name}
                                variants={cardVariants}
                            >
                                <Link
                                    to={`/?category=${category.slug}`}
                                    className="group block h-full"
                                >
                                    <div className="relative h-full overflow-hidden rounded-[30px] border border-[#EFE6DC] bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                                        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-gradient-to-br from-rose-100/70 to-amber-100/60 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FDF1F3] to-[#FFF7ED] text-[#B76E79] shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                            <Icon className="text-3xl" />
                                        </div>

                                        <h3 className="relative mt-8 text-2xl font-serif font-semibold text-[#2D2A26]">
                                            {category.name}
                                        </h3>

                                        <p className="relative mt-4 leading-7 text-[#6B655F]">
                                            {category.description}
                                        </p>

                                        <div className="relative mt-8 flex items-center gap-2 font-semibold text-[#B76E79] transition-all duration-300 group-hover:gap-4">
                                            <span>
                                                Explore Collection
                                            </span>

                                            <span className="text-lg">
                                                →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </Reveal>
            </div>
        </section>
    );
};

export default Categories;