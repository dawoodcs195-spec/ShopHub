import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

import heroImage from "../../assets/images/hero.jpeg";

const Hero = () => {
    const containerVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.18,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 30,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: "easeOut",
            },
        },
    };

    const imageVariants = {
        hidden: {
            opacity: 0,
            scale: 0.92,
            rotate: -2,
        },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.9,
                ease: "easeOut",
                delay: 0.3,
            },
        },
    };

    return (
        <section className="relative overflow-hidden bg-[#FCFAF7]">
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        y: [0, -15, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-rose-100/60 blur-3xl"
                />

                <motion.div
                    animate={{
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute right-0 top-20 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl"
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.span
                            variants={itemVariants}
                            className="inline-flex items-center rounded-full bg-rose-100 px-5 py-2 text-sm font-semibold tracking-wide text-rose-700"
                        >
                            Handmade • Crafted with Love
                        </motion.span>

                        <motion.h1
                            variants={itemVariants}
                            className="mt-8 text-5xl lg:text-7xl font-serif font-bold leading-[1.05] text-[#2D2A26]"
                        >
                            Every Creation
                            <br />
                            Tells a Story.
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="mt-8 max-w-xl text-lg leading-8 text-[#6B655F]"
                        >
                            Discover handcrafted candles, resin art,
                            personalized gifts, jewelry, and home décor
                            lovingly created to celebrate life's beautiful
                            moments.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="mt-10 flex flex-wrap gap-4"
                        >
                            <Link
                                to="/"
                                className="inline-flex items-center gap-3 rounded-full bg-[#B76E79] px-8 py-4 text-white font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                            >
                                Explore Collection

                                <FaArrowRight />
                            </Link>

                            <Link
                                to="/"
                                className="inline-flex items-center rounded-full border border-[#E7DDD3] bg-white px-8 py-4 font-semibold text-[#4A433D] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                Our Story
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mt-14 grid grid-cols-3 gap-8 max-w-lg"
                        >
                            <div>
                                <h3 className="text-3xl font-bold text-[#2D2A26]">
                                    100%
                                </h3>

                                <p className="mt-2 text-sm text-[#6B655F]">
                                    Handmade with care
                                </p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-[#2D2A26]">
                                    Premium
                                </h3>

                                <p className="mt-2 text-sm text-[#6B655F]">
                                    Materials used
                                </p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-[#2D2A26]">
                                    Unique
                                </h3>

                                <p className="mt-2 text-sm text-[#6B655F]">
                                    Every single piece
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={imageVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative"
                    >
                        <motion.div
                            animate={{
                                y: [0, -12, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="relative"
                        >
                            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-rose-100/40 to-amber-100/40 blur-2xl scale-95" />

                            <img
                                src={heroImage}
                                alt="Handcrafted Collection"
                                className="relative rounded-[40px] shadow-2xl w-full object-cover"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;