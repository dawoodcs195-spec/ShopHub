import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaGift, FaHeart } from "react-icons/fa";

import Button from "./Button";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const CustomOrders = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary dark:from-dark-background dark:to-dark-surface py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-rose-100/40 dark:bg-dark-accent/45 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-amber-100/40 dark:bg-dark-secondary/45 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge="Made Especially For You"
          title="Bring Your Ideas To Life"
          subtitle="Some gifts deserve to be one of a kind. We create personalized handmade pieces that celebrate your memories, your loved ones, and your special moments."
        />

        <div className="mt-20 grid items-center gap-14 lg:grid-cols-2">
          <Reveal y={22} duration={0.85}>
            <div className="rounded-[36px] border border-border dark:border-dark-border bg-card dark:bg-dark-card p-10 shadow-lift">
              <h3 className="font-serif text-3xl font-bold text-text-primary dark:text-dark-card-foreground">
                Handmade.
                <br />
                Personalized.
                <br />
                Unforgettable.
              </h3>

              <p className="mt-8 leading-8 text-text-secondary dark:text-dark-muted-foreground">
                Looking for something made just for you? Whether it's a personalized
                candle, resin keepsake, jewelry, decorative piece, pearl bag, or a
                thoughtful gift, we'd love to create something that's uniquely yours.
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/50 dark:bg-dark-accent/50 text-[#B76E79]">
                    <FaHeart />
                  </span>

                  <p className="text-text-secondary dark:text-dark-muted-foreground leading-7">
                    Personalized names, initials, colors, and custom designs.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/60 dark:bg-dark-secondary/60 text-[#B76E79]">
                    <FaGift />
                  </span>

                  <p className="text-text-secondary dark:text-dark-muted-foreground leading-7">
                    Perfect for birthdays, weddings, anniversaries, baby showers,
                    and special celebrations.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <Link to="/contact">
                  <Button size="lg">
                    Request a Custom Creation
                    <FaArrowRight />
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal y={22} duration={0.85} delay={0.05}>
            <div className="grid gap-6">
              {[
                {
                  title: "Personalized Resin Art",
                  description:
                    "Beautiful handcrafted resin creations customized with names, flowers, colors, and meaningful details.",
                },
                {
                  title: "Handmade Gift Sets",
                  description:
                    "Create a memorable gift by combining handcrafted candles, décor, jewelry, and personalized keepsakes into one beautiful collection.",
                },
                {
                  title: "Crafted With Care",
                  description:
                    "Every custom order is made by hand with patience, attention to detail, and the goal of creating something truly meaningful.",
                },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[30px] border border-border dark:border-dark-border bg-card dark:bg-dark-card p-8 shadow-soft"
                >
                  <h4 className="font-serif text-2xl font-semibold text-text-primary dark:text-dark-card-foreground">
                    {card.title}
                  </h4>

                  <p className="mt-4 leading-7 text-text-secondary dark:text-dark-muted-foreground">
                    {card.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default CustomOrders;