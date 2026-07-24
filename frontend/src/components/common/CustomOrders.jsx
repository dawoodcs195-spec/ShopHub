import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaGift, FaHeart } from "react-icons/fa";

import Button from "./Button";
import SectionHeading from "./SectionHeading";

const CustomOrders = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDFB] to-[#FCF6F3] py-28">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-rose-100/40 blur-3xl" />

                <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <SectionHeading
                    badge="Made Especially For You"
                    title="Bring Your Ideas To Life"
                    subtitle="Some gifts deserve to be one of a kind. We create personalized handmade pieces that celebrate your memories, your loved ones, and your special moments."
                />

                <div className="mt-20 grid items-center gap-14 lg:grid-cols-2">
                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -40,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        transition={{
                            duration: 0.8,
                        }}
                    >
                        <div className="rounded-[36px] border border-[#EFE6DC] bg-white p-10 shadow-xl">
                            <h3 className="font-serif text-3xl font-bold text-[#2D2A26]">
                                Handmade.
                                <br />
                                Personalized.
                                <br />
                                Unforgettable.
                            </h3>

                            <p className="mt-8 leading-8 text-[#6B655F]">
                                Looking for something made just for you?
                                Whether it's a personalized candle,
                                resin keepsake, jewelry, decorative
                                piece, pearl bag, or a thoughtful gift,
                                we'd love to create something that's
                                uniquely yours.
                            </p>

                            <div className="mt-10 space-y-5">
                                <div className="flex items-start gap-4">
                                    <FaHeart className="mt-1 text-[#B76E79]" />

                                    <p className="text-[#5F5751]">
                                        Personalized names,
                                        initials, colors, and
                                        custom designs.
                                    </p>
                                </div>

                                <div className="flex items-start gap-4">
                                    <FaGift className="mt-1 text-[#B76E79]" />

                                    <p className="text-[#5F5751]">
                                        Perfect for birthdays,
                                        weddings, anniversaries,
                                        baby showers, and special
                                        celebrations.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link
                                    to="/contact"
                                >
                                    <Button
                                        size="lg"
                                    >
                                        Request a Custom Creation

                                        <FaArrowRight />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 40,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        transition={{
                            duration: 0.8,
                        }}
                        className="grid gap-6"
                    >
                        <div className="rounded-[30px] border border-[#EFE6DC] bg-white p-8 shadow-lg">
                            <h4 className="font-serif text-2xl font-semibold text-[#2D2A26]">
                                Personalized Resin Art
                            </h4>

                            <p className="mt-4 leading-7 text-[#6B655F]">
                                Beautiful handcrafted resin creations
                                customized with names, flowers,
                                colors, and meaningful details.
                            </p>
                        </div>

                        <div className="rounded-[30px] border border-[#EFE6DC] bg-white p-8 shadow-lg">
                            <h4 className="font-serif text-2xl font-semibold text-[#2D2A26]">
                                Handmade Gift Sets
                            </h4>

                            <p className="mt-4 leading-7 text-[#6B655F]">
                                Create a memorable gift by combining
                                handcrafted candles, décor, jewelry,
                                and personalized keepsakes into one
                                beautiful collection.
                            </p>
                        </div>

                        <div className="rounded-[30px] border border-[#EFE6DC] bg-white p-8 shadow-lg">
                            <h4 className="font-serif text-2xl font-semibold text-[#2D2A26]">
                                Crafted With Care
                            </h4>

                            <p className="mt-4 leading-7 text-[#6B655F]">
                                Every custom order is made by hand with
                                patience, attention to detail, and the
                                goal of creating something truly
                                meaningful.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CustomOrders;