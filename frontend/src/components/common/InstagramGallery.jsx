import { motion } from "framer-motion";
import { FaInstagram, FaArrowRight } from "react-icons/fa";

import SectionHeading from "./SectionHeading";
import Button from "./Button";

import heroImage from "../../assets/images/hero.jpeg";
import storyImage from "../../assets/images/story.jpeg";

const galleryImages = [
    {
        image: heroImage,
        title: "Handcrafted Collection",
    },
    {
        image: storyImage,
        title: "Behind the Craft",
    },
    {
        image: heroImage,
        title: "Luxury Candles",
    },
    {
        image: storyImage,
        title: "Resin Art",
    },
    {
        image: heroImage,
        title: "Custom Gifts",
    },
    {
        image: storyImage,
        title: "Made with Love",
    },
];

const InstagramGallery = () => {
    return (
        <section className="relative overflow-hidden bg-[#FFFDFB] py-28">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-rose-100/40 blur-3xl" />

                <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-amber-100/30 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <SectionHeading
                    badge="Crafted Moments"
                    title="A Glimpse Into Our Handmade Journey"
                    subtitle="Every creation begins with inspiration, patience, and countless little moments behind the scenes. Here's a small look into our creative world."
                />

                <div className="mt-16 grid grid-cols-2 gap-5 md:grid-cols-3">
                    {galleryImages.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.08,
                            }}
                            whileHover={{
                                y: -8,
                            }}
                            className="group relative overflow-hidden rounded-[30px] shadow-lg"
                        >
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                            <div className="absolute bottom-0 left-0 right-0 translate-y-6 p-6 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                <h3 className="font-serif text-xl font-semibold">
                                    {item.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.7,
                    }}
                    className="mt-16 flex justify-center"
                >
                    <a
                        href="https://instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="secondary" size="lg">
                            <FaInstagram />

                            <span>
                                Follow Our Creative Journey
                            </span>

                            <FaArrowRight />
                        </Button>
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default InstagramGallery;