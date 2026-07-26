import { motion } from "framer-motion";
import { FaHeart, FaRegGem, FaShippingFast, FaGift } from "react-icons/fa";

import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

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
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.14 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const Features = () => {
  return (
    <section className="relative overflow-hidden bg-background dark:bg-dark-background py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-rose-100/40 dark:bg-dark-accent/45 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 dark:bg-dark-secondary/45 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why Choose Us"
          title="Crafted with Passion, Designed to Last"
          subtitle="Every handcrafted creation reflects care, creativity, and the joy of making something meaningful for you and your loved ones."
        />

        <Reveal variants={containerVariants} className="mt-10 sm:mt-14 lg:mt-16">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  className="group rounded-[26px] sm:rounded-[30px] border border-border dark:border-dark-border bg-card dark:bg-dark-card p-6 sm:p-8 shadow-soft transition-all duration-500 hover:shadow-2xl"
                >
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FDF1F3] to-[#FFF7ED] dark:from-dark-accent/60 dark:to-dark-secondary/60 text-[#B76E79] shadow-sm transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <Icon className="text-2xl sm:text-3xl" />
                  </div>

                  <h3 className="mt-6 sm:mt-8 font-serif text-xl sm:text-2xl font-semibold text-text-primary dark:text-dark-card-foreground">
                    {feature.title}
                  </h3>

                  <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-7 sm:leading-8 text-text-secondary dark:text-dark-muted-foreground">
                    {feature.description}
                  </p>

                  <div className="mt-6 sm:mt-8 h-px w-full bg-border/70 dark:bg-dark-border" />

                  <p className="mt-3 sm:mt-4 text-sm font-semibold tracking-wide text-[#B76E79]">
                    Our Promise
                  </p>
                </motion.div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Features;