import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaEnvelopeOpenText, FaArrowRight, FaWhatsapp } from "react-icons/fa";

import Reveal from "./Reveal";
import api from "../../services/api";

const BRAND_NAME = "Diya Expressions";
const WHATSAPP_URL = "https://wa.me/message/PI3GTQQXHTRWM1";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = email.trim();

    if (!trimmed) {
      toast.error("Please enter your email.");
      return;
    }

    if (!isValidEmail(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/newsletter/subscribe", { email: trimmed });

      toast.success(res?.data?.message || `Welcome to ${BRAND_NAME} letters. We'll be in touch soon.`);
      setEmail("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-background dark:bg-dark-background py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-8 h-80 w-80 rounded-full bg-rose-100/45 dark:bg-dark-accent/45 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-amber-100/35 dark:bg-dark-secondary/45 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal y={18} duration={0.85}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground dark:bg-dark-accent dark:text-dark-accent-foreground px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold tracking-wide">
              Newsletter
            </span>

            <h2 className="mt-5 sm:mt-6 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary dark:text-dark-card-foreground">
              A Small Letter From the Studio
            </h2>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-text-secondary dark:text-dark-muted-foreground">
              Join for new collections, behind-the-scenes crafting moments, and early access to limited creations.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 sm:mt-14 lg:mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal y={18} duration={0.85} delay={0.05}>
            <div>
              <p className="text-base sm:text-lg leading-8 sm:leading-9 text-text-secondary dark:text-dark-muted-foreground">
                Not every creation makes it to the storefront right away. Sometimes we share the first look with our
                subscribers—quietly, warmly, and personally.
              </p>

              <div className="mt-8 sm:mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border dark:border-dark-border bg-card dark:bg-dark-card p-5 sm:p-6 shadow-soft">
                  <p className="text-sm font-semibold tracking-wide text-[#B76E79]">Early Access</p>
                  <p className="mt-3 text-sm sm:text-base leading-7 text-text-secondary dark:text-dark-muted-foreground">
                    Be the first to see limited pieces before they sell out.
                  </p>
                </div>

                <div className="rounded-3xl border border-border dark:border-dark-border bg-card dark:bg-dark-card p-5 sm:p-6 shadow-soft">
                  <p className="text-sm font-semibold tracking-wide text-[#B76E79]">Studio Stories</p>
                  <p className="mt-3 text-sm sm:text-base leading-7 text-text-secondary dark:text-dark-muted-foreground">
                    Behind-the-scenes moments—flowers, wax, resin, and hands at work.
                  </p>
                </div>
              </div>

              <div className="mt-8 sm:mt-10">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-wrap items-center gap-3 font-semibold text-[#B76E79] transition-all hover:gap-5"
                >
                  Prefer WhatsApp updates?
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent/60 dark:bg-dark-accent/60 px-4 py-2 text-sm font-semibold text-[#B76E79]">
                    <FaWhatsapp />
                    Message us
                  </span>
                  <FaArrowRight />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal y={18} duration={0.85} delay={0.08}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] border border-border dark:border-dark-border bg-card dark:bg-dark-card p-6 sm:p-8 lg:p-10 shadow-lift"
            >
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-rose-100/60 to-amber-100/50 dark:from-dark-accent/55 dark:to-dark-secondary/55 blur-2xl" />

              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FDF1F3] to-[#FFF7ED] dark:from-dark-accent/60 dark:to-dark-secondary/60 text-[#B76E79] shadow-sm">
                    <FaEnvelopeOpenText className="text-xl sm:text-2xl" />
                  </div>

                  <div>
                    <p className="font-serif text-xl sm:text-2xl font-semibold text-text-primary dark:text-dark-card-foreground">
                      Join the list
                    </p>
                    <p className="mt-1 text-sm text-text-secondary dark:text-dark-muted-foreground">
                      No spam — only warm studio updates.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 space-y-4">
                  <label className="block text-sm font-semibold text-text-primary dark:text-dark-card-foreground">
                    Email address
                  </label>

                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-border dark:border-dark-border bg-background dark:bg-dark-secondary px-5 py-4 text-text-primary dark:text-dark-card-foreground placeholder:text-muted-foreground/70 dark:placeholder:text-dark-muted-foreground/70 shadow-soft focus:outline-none focus:ring-4 focus:ring-ring/25 dark:focus:ring-dark-ring/25"
                    autoComplete="email"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-[#B76E79] py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Please wait..." : "Subscribe"}
                  </button>

                  <p className="pt-2 text-xs leading-6 text-text-secondary dark:text-dark-muted-foreground">
                    By subscribing, you agree to receive occasional updates from {BRAND_NAME}. You can unsubscribe anytime.
                  </p>
                </form>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;