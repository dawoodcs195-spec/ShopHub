import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFire, FaRegGem, FaHeart, FaGift, FaLeaf, FaStar } from "react-icons/fa";

import Reveal from "./Reveal";

const categories = [
  {
    name: "Signature Candles",
    description: "Hand-poured candles crafted to bring warmth and comfort to every space.",
    icon: FaFire,
    // matches DB (your candles already work with this)
    categoryParam: "candles",
  },
  {
    name: "Resin Art",
    description: "Unique handcrafted resin creations inspired by nature and elegance.",
    icon: FaRegGem,
    // matches DB example: "Resin art"
    categoryParam: "Resin art",
  },
  {
    name: "Floral Collection",
    description: "Delicate floral designs made to celebrate beauty in every season.",
    icon: FaLeaf,
    // matches DB example: "Floral collection"
    categoryParam: "Floral collection",
  },
  {
    name: "Personalized Gifts",
    description: "Thoughtful keepsakes created especially for your loved ones.",
    icon: FaGift,
    // adjust this if your DB uses a different exact string
    categoryParam: "Personalized Gifts",
  },
  {
    name: "Handmade Accessories",
    description: "Beautiful handcrafted pieces designed to complete every occasion.",
    icon: FaStar,
    // matches DB example EXACTLY (including trailing space)
    categoryParam: "handmade accessories ",
  },
  {
    name: "Best Sellers",
    description: "Discover the creations our customers fall in love with the most.",
    icon: FaHeart,
    // special view handled in Home.jsx
    categoryParam: "best-sellers",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Categories = () => {
  return (
    <section className="bg-background dark:bg-dark-background py-12 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal y={24} duration={0.85} className="max-w-2xl mx-auto text-center mb-10 sm:mb-16">
          <span className="inline-block rounded-full bg-accent text-accent-foreground dark:bg-dark-accent dark:text-dark-accent-foreground px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide">
            Our Collections
          </span>

          <h2 className="mt-5 text-3xl sm:text-5xl font-serif font-bold text-text-primary dark:text-dark-card-foreground leading-tight">
            Crafted for Every
            <br />
            Beautiful Moment
          </h2>

          <p className="mt-4 text-[15px] sm:text-lg leading-7 sm:leading-8 text-text-secondary dark:text-dark-muted-foreground">
            Explore thoughtfully handcrafted creations designed with care, creativity, and timeless elegance.
          </p>
        </Reveal>

        <Reveal variants={containerVariants}>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 min-[360px]:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8"
          >
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <motion.div key={category.name} variants={cardVariants}>
                  <Link
                    to={`/?category=${encodeURIComponent(category.categoryParam)}`}
                    className="group block h-full"
                  >
                    <div className="relative h-full overflow-hidden rounded-[22px] sm:rounded-[30px] border border-border dark:border-dark-border bg-card dark:bg-dark-card p-4 sm:p-8 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                      <div className="absolute right-0 top-0 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-br from-rose-100/60 to-amber-100/50 dark:from-dark-accent/60 dark:to-dark-secondary/60 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="relative flex h-11 w-11 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FDF1F3] to-[#FFF7ED] dark:from-dark-accent/60 dark:to-dark-secondary/60 text-[#B76E79] shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                        <Icon className="text-xl sm:text-3xl" />
                      </div>

                      <h3 className="relative mt-4 sm:mt-8 text-[15px] sm:text-2xl font-serif font-semibold text-text-primary dark:text-dark-card-foreground">
                        {category.name}
                      </h3>

                      <p className="relative mt-2.5 sm:mt-4 text-[13px] sm:text-base leading-6 sm:leading-7 text-text-secondary dark:text-dark-muted-foreground line-clamp-3 sm:line-clamp-none">
                        {category.description}
                      </p>

                      <div className="relative mt-4 sm:mt-8 flex items-center gap-2 text-sm sm:text-base font-semibold text-[#B76E79] transition-all duration-300 group-hover:gap-4">
                        <span>Explore</span>
                        <span className="text-lg">→</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
};

export default Categories;