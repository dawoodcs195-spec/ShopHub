import { motion } from "framer-motion";
import {
    FaHeart,
    FaRegGem,
    FaShippingFast,
    FaGift,
} from "react-icons/fa";

import SectionHeading from "./SectionHeading";

const features = [
    {
        icon: FaHeart,
        title: "Made with Love",
        description:
            "Every creation is carefully handcrafted with passion, patience, and attention to every little detail, making each piece truly one of a kind.",
    },
    {
        icon: FaRegGem,
        title: "Premium Materials",
        description:
            "From premium wax and resin to carefully selected pigments and embellishments, only quality materials become part of your keepsake.",
    },
    {
        icon: FaGift,
        title: "Perfect for Gifting",
        description:
            "Whether it's a birthday, anniversary, wedding, or a thoughtful surprise, every piece is designed to become a meaningful gift.",
    },
    {
        icon: FaShippingFast,
        title: "Packed with Care",
        description:
            "Every order is securely and beautifully packaged to ensure it reaches your doorstep safely and ready to be cherished.",
    },
];

const containerVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 35,
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

const iconMotion = {
    rest: {
        rotate: 0,
        scale: 1,
    },
    hover: {
        rotate: 8,
        scale: 1.08,
    },
};

const Features = () => {
    return (
        <section className="relative overflow-hidden bg-[#FCFAF7] py-24">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-rose-100/40 blur-3xl" />

                <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <SectionHeading
                    badge="Why Choose Us"
                    title="Crafted with Passion, Designed to Last"
                    subtitle="Every handcrafted creation reflects care, creativity, and the joy of making something meaningful for you and your loved ones."
                />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.2,
                    }}
                    className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4"
                >
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={feature.title}
                                variants={cardVariants}
                                whileHover={{
                                    y: -8,
                                }}
                                className="group rounded-[30px] border border-[#EFE6DC] bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-2xl"
                            >
                                <motion.div
                                    variants={iconMotion}
                                    initial="rest"
                                    whileHover="hover"
                                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FDF1F3] to-[#FFF7ED] text-[#B76E79] shadow-sm"
                                >
                                    <Icon className="text-3xl" />
                                </motion.div>

                                <h3 className="mt-8 font-serif text-2xl font-semibold text-[#2D2A26]">
                                    {feature.title}
                                </h3>

                                <p className="mt-5 leading-8 text-[#6B655F]">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;