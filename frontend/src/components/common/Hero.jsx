import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

import heroImage from "../../assets/images/hero.jpeg";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.16 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, rotate: -2 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.9, ease: "easeOut", delay: 0.2 },
    },
  };

  return (
    <section className="relative overflow-hidden bg-[#FCFAF7] dark:bg-dark-background">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-rose-100/60 dark:bg-dark-accent/35 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-20 w-96 h-96 rounded-full bg-amber-100/40 dark:bg-dark-secondary/35 blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center rounded-full bg-rose-100 dark:bg-dark-accent/30 px-4 py-1.5 text-xs font-semibold tracking-wide text-rose-700 dark:text-dark-card-foreground"
            >
              Handmade • Crafted with Love
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="mt-5 font-serif font-bold leading-[1.06] text-[#2D2A26] dark:text-dark-card-foreground
                         text-[clamp(2rem,9vw,3.2rem)] sm:text-5xl lg:text-7xl"
            >
              Every Creation
              <br />
              Tells a Story.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-xl text-[15px] sm:text-lg leading-7 sm:leading-8 text-[#6B655F] dark:text-dark-muted-foreground"
            >
              Discover handcrafted candles, resin art, personalized gifts, jewelry, and home décor lovingly
              created to celebrate life's beautiful moments.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-7 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link
                to="/?explore=1"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#B76E79]
                           px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base text-white font-semibold shadow-lg
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                Explore Collection <FaArrowRight />
              </Link>

              <Link
                to="/?story=1"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-[#E7DDD3] dark:border-dark-border
                           bg-white/90 dark:bg-dark-card px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold
                           text-[#4A433D] dark:text-dark-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                Our Story
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 sm:mt-14 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg">
              <div>
                <h3 className="text-xl sm:text-3xl font-bold text-[#2D2A26] dark:text-dark-card-foreground">
                  100%
                </h3>
                <p className="mt-1.5 text-[11px] sm:text-sm text-[#6B655F] dark:text-dark-muted-foreground">
                  Handmade with care
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-3xl font-bold text-[#2D2A26] dark:text-dark-card-foreground">
                  Premium
                </h3>
                <p className="mt-1.5 text-[11px] sm:text-sm text-[#6B655F] dark:text-dark-muted-foreground">
                  Materials used
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-3xl font-bold text-[#2D2A26] dark:text-dark-card-foreground">
                  Unique
                </h3>
                <p className="mt-1.5 text-[11px] sm:text-sm text-[#6B655F] dark:text-dark-muted-foreground">
                  Every piece
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative max-w-xl mx-auto lg:max-w-none"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-[28px] sm:rounded-[40px] bg-gradient-to-br from-rose-100/40 to-amber-100/40 dark:from-dark-accent/25 dark:to-dark-secondary/25 blur-2xl scale-95" />
              <img
                src={heroImage}
                alt="Handcrafted Collection"
                className="relative rounded-[28px] sm:rounded-[40px] shadow-2xl w-full object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;