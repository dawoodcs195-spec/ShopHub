import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

import Reveal from "./Reveal";

const testimonials = [
  {
    name: "Ayesha",
    meta: "Custom Resin Gift",
    quote:
      "The detailing was so delicate and beautiful. It felt like receiving something made with real care — not just a product.",
    rating: 5,
  },
  {
    name: "Hira",
    meta: "Handmade Candle Set",
    quote:
      "The packaging was gorgeous and the fragrance was so comforting. You can tell it’s handmade — it feels personal.",
    rating: 5,
  },
  {
    name: "Sara",
    meta: "Personalized Keepsake",
    quote:
      "I requested a custom piece and it turned out even better than I imagined. It feels like a memory captured forever.",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const Testimonials = () => {
  return (
    <section className="relative overflow-hidden bg-background dark:bg-dark-background py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-rose-100/40 dark:bg-dark-accent/45 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-amber-100/30 dark:bg-dark-secondary/45 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal y={20} duration={0.85}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground dark:bg-dark-accent dark:text-dark-accent-foreground px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold tracking-wide">
              Testimonials
            </span>

            <h2 className="mt-5 sm:mt-6 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary dark:text-dark-card-foreground">
              Loved by Customers, Cherished as Gifts
            </h2>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-text-secondary dark:text-dark-muted-foreground">
              Kind words mean the world to us — every review is a reminder that handmade still matters.
            </p>
          </div>
        </Reveal>

        <Reveal variants={containerVariants} className="mt-10 sm:mt-14 lg:mt-16">
          <motion.div
            variants={containerVariants}
            className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[26px] sm:rounded-[30px] border border-border dark:border-dark-border bg-card dark:bg-dark-card p-6 sm:p-8 shadow-soft hover:shadow-2xl transition-shadow duration-500"
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-rose-100/60 to-amber-100/50 dark:from-dark-accent/55 dark:to-dark-secondary/55 blur-2xl opacity-70" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="font-serif text-xl sm:text-2xl font-semibold text-text-primary dark:text-dark-card-foreground">
                        {t.name}
                      </p>
                      <p className="mt-1 text-xs sm:text-sm font-medium tracking-wide text-[#B76E79]">
                        {t.meta}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[#C7A35B]">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <FaStar key={i} className="text-sm" />
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 flex gap-4">
                    <FaQuoteLeft className="mt-1 text-[#B76E79]/70" />
                    <p className="text-base sm:text-lg leading-8 sm:leading-9 text-text-secondary dark:text-dark-muted-foreground">
                      {t.quote}
                    </p>
                  </div>

                  <div className="mt-6 sm:mt-8 h-px w-full bg-border/70 dark:bg-dark-border" />

                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-text-secondary dark:text-dark-muted-foreground">
                    Verified customer feedback • Handmade experience
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
};

export default Testimonials;