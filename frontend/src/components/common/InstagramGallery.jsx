import { motion } from "framer-motion";
import { FaInstagram, FaArrowRight } from "react-icons/fa";

import Button from "./Button";
import Reveal from "./Reveal";

const INSTAGRAM_URL =
  "https://www.instagram.com/diya_artful_expressions123/?utm_source=ig_web_button_share_sheet";

const galleryImages = [
  { image: "/journey/journey-1.jpg", title: "Behind the Pour" },
  { image: "/journey/journey-2.jpg", title: "Studio Details" },
  { image: "/journey/journey-3.jpg", title: "Handcrafted Moments" },
  { image: "/journey/journey-4.jpg", title: "Resin in Motion" },
  { image: "/journey/journey-5.jpg", title: "Packaging with Care" },
  { image: "/journey/journey-6.jpg", title: "Finished Creations" },
];

const InstagramGallery = () => {
  return (
    <section className="relative overflow-hidden bg-background dark:bg-dark-background py-16 sm:py-20 lg:py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-rose-100/40 dark:bg-dark-accent/45 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-amber-100/30 dark:bg-dark-secondary/45 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal y={18} duration={0.85}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground dark:bg-dark-accent dark:text-dark-accent-foreground px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold tracking-wide">
              Crafted Moments
            </span>

            <h2 className="mt-5 sm:mt-6 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary dark:text-dark-card-foreground">
              A Glimpse Into Our Handmade Journey
            </h2>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-text-secondary dark:text-dark-muted-foreground">
              Every creation begins with inspiration, patience, and countless little moments behind
              the scenes. Here's a small look into our creative world.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 sm:mt-14 lg:mt-16 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
          {galleryImages.map((item, index) => (
            <motion.div
              key={item.image}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[22px] sm:rounded-[30px] border border-border/60 dark:border-dark-border shadow-lg"
            >
              <div className="aspect-square overflow-hidden bg-card dark:bg-dark-card">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="absolute bottom-0 left-0 right-0 translate-y-6 p-4 sm:p-6 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <h3 className="font-serif text-base sm:text-xl font-semibold">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-10 sm:mt-14 lg:mt-16 flex justify-center"
        >
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto justify-center dark:bg-dark-secondary dark:text-dark-card-foreground dark:border dark:border-dark-border dark:hover:bg-dark-secondary/80"
            >
              <FaInstagram />
              <span>Follow Our Creative Journey</span>
              <FaArrowRight />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramGallery;