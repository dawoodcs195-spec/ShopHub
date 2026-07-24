import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaEnvelopeOpenText, FaArrowRight, FaWhatsapp } from "react-icons/fa";

import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const isValidEmail = (email) => {
    // Simple + safe for UI validation (backend validation comes later)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

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

        // Frontend-only for now (premium UX, no broken endpoint)
        try {
            setLoading(true);
            await new Promise((r) => setTimeout(r, 450));

            toast.success("Welcome to ShopHub letters. We'll be in touch soon.");
            setEmail("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative overflow-hidden bg-[#FFFDFB] py-28">
            {/* Warm glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-8 h-80 w-80 rounded-full bg-rose-100/45 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-amber-100/35 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <Reveal y={18} duration={0.85}>
                    <SectionHeading
                        badge="Newsletter"
                        title="A Small Letter From the Studio"
                        subtitle="Join for new collections, behind-the-scenes crafting moments, and early access to limited creations."
                    />
                </Reveal>

                <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
                    {/* Left: copy */}
                    <Reveal y={18} duration={0.85} delay={0.05}>
                        <div>
                            <p className="text-lg leading-9 text-[#5F5751]">
                                Not every creation makes it to the storefront right away.
                                Sometimes we share the first look with our subscribers—quietly,
                                warmly, and personally.
                            </p>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl border border-[#EFE6DC] bg-white p-6 shadow-sm">
                                    <p className="text-sm font-semibold tracking-wide text-[#B76E79]">
                                        Early Access
                                    </p>
                                    <p className="mt-3 leading-7 text-[#6B655F]">
                                        Be the first to see limited pieces before they sell out.
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-[#EFE6DC] bg-white p-6 shadow-sm">
                                    <p className="text-sm font-semibold tracking-wide text-[#B76E79]">
                                        Studio Stories
                                    </p>
                                    <p className="mt-3 leading-7 text-[#6B655F]">
                                        Behind-the-scenes moments—flowers, wax, resin, and hands at work.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <a
                                    href="https://wa.me/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 font-semibold text-[#B76E79] transition-all hover:gap-5"
                                >
                                    Prefer WhatsApp updates?

                                    <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-[#B76E79]">
                                        <FaWhatsapp />
                                        Message us
                                    </span>

                                    <FaArrowRight />
                                </a>
                            </div>
                        </div>
                    </Reveal>

                    {/* Right: subscription card */}
                    <Reveal y={18} duration={0.85} delay={0.08}>
                        <motion.div
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="relative overflow-hidden rounded-[36px] border border-[#EFE6DC] bg-white p-10 shadow-xl"
                        >
                            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-rose-100/70 to-amber-100/60 blur-2xl" />

                            <div className="relative">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FDF1F3] to-[#FFF7ED] text-[#B76E79] shadow-sm">
                                        <FaEnvelopeOpenText className="text-2xl" />
                                    </div>

                                    <div>
                                        <p className="font-serif text-2xl font-semibold text-[#2D2A26]">
                                            Join the list
                                        </p>
                                        <p className="mt-1 text-sm text-[#6B655F]">
                                            No spam — only warm studio updates.
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="mt-10 space-y-4">
                                    <label className="block text-sm font-semibold text-[#2D2A26]">
                                        Email address
                                    </label>

                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full rounded-2xl border border-[#EFE6DC] bg-[#FFFDFB] px-5 py-4 text-[#2D2A26] placeholder:text-[#9A8F89] shadow-sm focus:outline-none focus:ring-4 focus:ring-[#D8B2A1]/25"
                                        autoComplete="email"
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full rounded-full bg-[#B76E79] py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Please wait..." : "Subscribe"}
                                    </button>

                                    <p className="pt-2 text-xs leading-6 text-[#6B655F]">
                                        By subscribing, you agree to receive occasional updates from ShopHub.
                                        You can unsubscribe anytime.
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