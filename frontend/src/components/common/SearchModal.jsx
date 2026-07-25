import {
    useEffect,
    useRef,
} from "react";
import {
    AnimatePresence,
    motion,
} from "framer-motion";
import {
    FaSearch,
    FaTimes,
} from "react-icons/fa";

const backdropVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.25,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

const modalVariants = {
    hidden: {
        opacity: 0,
        y: -40,
        scale: 0.96,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        transition: {
            duration: 0.2,
        },
    },
};

const SearchModal = ({
    open,
    keyword,
    setKeyword,
    onClose,
    children,
}) => {
    const inputRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        inputRef.current?.focus();

        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );

            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(
                    e.target
                )
            ) {
                onClose();
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-md flex items-start justify-center px-5 pt-24"
                >
                    <motion.div
                        ref={modalRef}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl"
                    >
                        <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-5">
                            <FaSearch className="text-slate-400 text-xl" />

                            <input
                                ref={inputRef}
                                type="text"
                                value={keyword}
                                onChange={(e) =>
                                    setKeyword(
                                        e.target.value
                                    )
                                }
                                placeholder="Search handmade creations..."
                                className="flex-1 bg-transparent text-lg outline-none placeholder:text-slate-400"
                            />

                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="max-h-[65vh] overflow-y-auto">
                            {children}
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500">
                            <span>
                                Press ESC to close
                            </span>

                            <span>
                                ↑ ↓ Navigate •
                                Enter Open
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;