import { motion } from "framer-motion";

import SectionHeading from "./SectionHeading";

import storyImage from "../../assets/images/story.jpeg";

const values = [
    {
        title: "100% Handmade",
        description:
            "Every creation is carefully crafted by hand with patience and attention to every detail.",
    },
    {
        title: "Made with Love",
        description:
            "Each piece is created with genuine passion, making every product truly meaningful.",
    },
    {
        title: "Custom Orders",
        description:
            "Personalized creations designed especially for you and your loved ones.",
    },
    {
        title: "One of a Kind",
        description:
            "No two handcrafted creations are exactly alike, making every purchase unique.",
    },
];

const MeetArtist = () => {
    return (
        <section className="relative overflow-hidden bg-[#FFFDFB] py-28">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-rose-100/40 blur-3xl" />

                <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-amber-100/30 blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeading
                    badge="Our Story"
                    title="Meet the Artist"
                    subtitle="Every handcrafted creation begins with curiosity, creativity, and a love for making something beautiful."
                />

                <div className="mt-20 grid items-center gap-16 lg:grid-cols-2">
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
                        className="relative"
                    >
                        <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-rose-100/40 to-amber-100/40 blur-2xl scale-95" />

                        <img
                            src={storyImage}
                            alt="Creating handmade art"
                            className="relative w-full rounded-[36px] object-cover shadow-2xl"
                        />
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
                    >
                        <p className="text-lg leading-9 text-[#5F5751]">
                            What began as a simple hobby in a small room slowly
                            became something much more meaningful.
                        </p>

                        <p className="mt-8 text-lg leading-9 text-[#5F5751]">
                            It all started with creating small bracelets and
                            necklaces simply for the joy of making something
                            beautiful by hand. Every finished piece inspired a
                            new idea, and every experiment became another step
                            in a creative journey.
                        </p>

                        <p className="mt-8 text-lg leading-9 text-[#5F5751]">
                            Discovering resin art opened an entirely new world
                            of creativity. Soon, friends began requesting custom
                            handmade creations, encouraging the journey to grow
                            into beautiful candles, resin décor, personalized
                            jewelry, pearl bags, keepsakes, and thoughtful
                            gifts.
                        </p>

                        <p className="mt-8 text-lg leading-9 text-[#5F5751]">
                            Today every creation is still handmade with the same
                            excitement, patience, and attention to detail as
                            the very first piece. The hope behind every product
                            is simple — to bring beauty, warmth, and a little
                            happiness into someone's life.
                        </p>

                        <div className="mt-10 rounded-3xl border-l-4 border-[#B76E79] bg-rose-50 p-6">
                            <p className="font-serif text-2xl italic text-[#2D2A26]">
                                "Every creation tells a story, and I hope one
                                day one of my creations becomes part of yours."
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-24 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {values.map((item) => (
                        <motion.div
                            key={item.title}
                            initial={{
                                opacity: 0,
                                y: 25,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                duration: 0.6,
                            }}
                            whileHover={{
                                y: -8,
                            }}
                            className="rounded-3xl border border-[#EFE6DC] bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
                        >
                            <h3 className="font-serif text-2xl font-semibold text-[#2D2A26]">
                                {item.title}
                            </h3>

                            <p className="mt-4 leading-7 text-[#6B655F]">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MeetArtist;