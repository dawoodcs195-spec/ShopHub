// frontend/src/components/layout/Navbar.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    FaShoppingCart,
    FaUser,
    FaHeart,
    FaBars,
    FaTimes,
    FaSearch,
    FaSignOutAlt,
    FaTachometerAlt,
    FaHome,
    FaMoon,
    FaSun,
    FaEnvelopeOpenText,
    FaClipboardList,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useTheme } from "../../context/ThemeContext";

import SearchModal from "../common/SearchModal";
import SearchResult from "../common/SearchResult";
import RecentSearches from "../common/RecentSearches";
import * as PopularSearchesModule from "../common/PopularSearches";

import useDebounce from "../../hooks/useDebounce";
import { getProducts } from "../../services/productService";

const PopularSearches =
    PopularSearchesModule.default || PopularSearchesModule.PopularSearches;

const RECENT_SEARCHES_KEY = "recentSearches";

const BRAND_NAME = "Diya Expressions";
const BRAND_LOGO_SRC = "/favicon.svg"; // place at: frontend/public/favicon.svg

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const { wishlist } = useWishlist();
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === "dark";

    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [keyword, setKeyword] = useState("");

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [recentSearches, setRecentSearches] = useState(() => {
        try {
            const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    const debouncedKeyword = useDebounce(keyword, 300);

    // Desktop profile dropdown
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const lastScrollY = useRef(0);
    const rafRef = useRef(null);

    const searchRequestIdRef = useRef(0);
    const skipDebouncedFetchRef = useRef("");

    // ✅ Logo preview modal (works desktop + mobile)
    const [isLogoPreviewOpen, setIsLogoPreviewOpen] = useState(false);

    const totalCartItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const closeUserMenu = useCallback(() => setIsUserMenuOpen(false), []);

    const closeMobileMenu = useCallback(() => setMenuOpen(false), []);

    const openLogoPreview = useCallback(() => {
        setIsLogoPreviewOpen(true);
        closeUserMenu();
        setMenuOpen(false);
        setIsSearchOpen(false);
    }, [closeUserMenu]);

    const closeLogoPreview = useCallback(() => {
        setIsLogoPreviewOpen(false);
    }, []);

    // ESC + scroll lock for logo preview modal
    useEffect(() => {
        if (!isLogoPreviewOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") closeLogoPreview();
        };

        document.addEventListener("keydown", onKeyDown);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [isLogoPreviewOpen, closeLogoPreview]);

    const addRecentSearch = useCallback((value) => {
        const term = String(value || "").trim();
        if (!term) return;

        setRecentSearches((prev) => {
            const next = [term, ...prev.filter((s) => s !== term)];
            return next.slice(0, 8);
        });
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(
                RECENT_SEARCHES_KEY,
                JSON.stringify(recentSearches)
            );
        } catch {
            // ignore
        }
    }, [recentSearches]);

    const closeSearch = useCallback(() => {
        searchRequestIdRef.current += 1;
        setIsSearchOpen(false);
        setIsSearching(false);
        setSearchResults([]);
        setSearchError("");
        setKeyword("");
        skipDebouncedFetchRef.current = "";
    }, []);

    const openSearch = useCallback(() => {
        setIsSearchOpen(true);
        setMenuOpen(false);
        closeUserMenu();
    }, [closeUserMenu]);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        closeUserMenu();
        navigate("/");
    };

    const handleToggleTheme = () => {
        toggleTheme();
        closeUserMenu();
    };

    const fetchSearchResults = useCallback(async (term) => {
        const currentId = (searchRequestIdRef.current += 1);

        setIsSearching(true);
        setSearchError("");
        setSearchResults([]);

        try {
            const data = await getProducts({
                keyword: term,
                page: 1,
                limit: 8,
            });

            let products = [];

            if (Array.isArray(data)) {
                products = data;
            } else if (Array.isArray(data?.products)) {
                products = data.products;
            } else if (Array.isArray(data?.data)) {
                products = data.data;
            } else if (Array.isArray(data?.data?.products)) {
                products = data.data.products;
            }

            if (currentId !== searchRequestIdRef.current) return;

            setSearchResults(products);
        } catch (err) {
            if (currentId !== searchRequestIdRef.current) return;

            setSearchResults([]);
            setSearchError("Failed to load search results.");
        } finally {
            if (currentId !== searchRequestIdRef.current) return;
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        if (!isSearchOpen) return;

        const term = debouncedKeyword.trim();

        if (!term) {
            searchRequestIdRef.current += 1;
            setIsSearching(false);
            setSearchResults([]);
            setSearchError("");
            return;
        }

        if (skipDebouncedFetchRef.current === term) {
            skipDebouncedFetchRef.current = "";
            return;
        }

        fetchSearchResults(term);
    }, [debouncedKeyword, isSearchOpen, fetchSearchResults]);

    useEffect(() => {
        if (!isSearchOpen) return;

        const onKeyDown = (e) => {
            if (e.key !== "Enter") return;

            const search = keyword.trim();
            if (!search) return;

            e.preventDefault();

            addRecentSearch(search);
            navigate(`/?keyword=${encodeURIComponent(search)}`);
            closeSearch();
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [isSearchOpen, keyword, addRecentSearch, navigate, closeSearch]);

    const handleSelectSuggestion = (value) => {
        const term = String(value || "").trim();
        if (!term) return;

        setKeyword(term);
        addRecentSearch(term);

        if (isSearchOpen) {
            skipDebouncedFetchRef.current = term;
            fetchSearchResults(term);
        }
    };

    const handleResultClose = () => {
        const term = keyword.trim();
        if (term) addRecentSearch(term);
        closeSearch();
    };

    // Hide on scroll down, show on scroll up
    useEffect(() => {
        lastScrollY.current = window.scrollY || 0;

        const handleScroll = () => {
            if (rafRef.current) return;

            rafRef.current = window.requestAnimationFrame(() => {
                const currentY = window.scrollY || 0;

                setScrolled(currentY > 10);

                // Keep navbar visible at top + while mobile menu is open
                if (isMenuOpen || currentY < 10) {
                    setIsVisible(true);
                    lastScrollY.current = currentY;
                    rafRef.current = null;
                    return;
                }

                const prevY = lastScrollY.current;
                const delta = currentY - prevY;

                if (Math.abs(delta) < 8) {
                    rafRef.current = null;
                    return;
                }

                const HIDE_AFTER = 120;

                if (currentY > prevY && currentY > HIDE_AFTER) {
                    setIsVisible(false);
                    closeUserMenu();
                } else if (currentY < prevY) {
                    setIsVisible(true);
                }

                lastScrollY.current = currentY;
                rafRef.current = null;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
        };
    }, [isMenuOpen, closeUserMenu]);

    // Close desktop user menu on outside click + Escape
    useEffect(() => {
        if (!isUserMenuOpen) return;

        const onMouseDown = (e) => {
            if (!userMenuRef.current) return;
            if (!userMenuRef.current.contains(e.target)) {
                closeUserMenu();
            }
        };

        const onKeyDown = (e) => {
            if (e.key === "Escape") closeUserMenu();
        };

        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [isUserMenuOpen, closeUserMenu]);

    // Mobile menu: ESC closes + lock body scroll
    useEffect(() => {
        if (!isMenuOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") closeMobileMenu();
        };

        document.addEventListener("keydown", onKeyDown);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [isMenuOpen, closeMobileMenu]);

    const drawerVariants = {
        open: {
            x: 0,
            transition: { type: "spring", stiffness: 320, damping: 34 },
        },
        closed: {
            x: "100%",
            transition: { type: "spring", stiffness: 320, damping: 34 },
        },
    };

    const overlayVariants = {
        open: { opacity: 1, transition: { duration: 0.2 } },
        closed: { opacity: 0, transition: { duration: 0.2 } },
    };

    const NavItem = ({ to, children, icon: Icon }) => (
        <NavLink
            to={to}
            onClick={() => {
                setMenuOpen(false);
                closeUserMenu();
            }}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-colors duration-200 ${
                    isActive
                        ? "bg-primary/12 text-primary dark:bg-dark-accent/30 dark:text-dark-card-foreground"
                        : "text-text-primary dark:text-dark-card-foreground hover:bg-secondary/50 dark:hover:bg-dark-secondary/30"
                }`
            }
        >
            <Icon className="w-5 h-5 opacity-90" />
            <span>{children}</span>
        </NavLink>
    );

    const trimmedKeyword = keyword.trim();

    return (
        <>
            <motion.header
                initial={false}
                animate={{ y: isVisible ? 0 : "-110%" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={[
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled
                        ? "bg-background/85 dark:bg-dark-card/85 backdrop-blur-xl border-b border-border/70 dark:border-dark-border shadow-soft"
                        : "bg-background/95 dark:bg-dark-card/95 border-b border-transparent",
                ].join(" ")}
            >
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <div className="flex items-center gap-3">
                                {/* ✅ Logo image opens preview */}
                                <button
                                    type="button"
                                    onClick={openLogoPreview}
                                    className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 dark:focus-visible:ring-dark-ring/40"
                                    aria-label="Preview logo"
                                    title="Preview logo"
                                >
                                    <img
                                        src={BRAND_LOGO_SRC}
                                        alt={BRAND_NAME}
                                        className="h-10 w-10 rounded-full object-cover shadow-soft"
                                    />
                                </button>

                                {/* ✅ Brand text goes home */}
                                <Link
                                    to="/"
                                    className="text-2xl sm:text-3xl font-bold text-card-foreground dark:text-dark-card-foreground tracking-tighter"
                                    onClick={() => closeUserMenu()}
                                    aria-label={BRAND_NAME}
                                    title="Go to home"
                                >
                                    {BRAND_NAME}
                                </Link>
                            </div>
                        </div>

                        {/* Desktop Search */}
                        <div className="hidden md:flex flex-grow max-w-xl mx-8">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search handmade creations..."
                                    value={keyword}
                                    readOnly
                                    onClick={openSearch}
                                    className={[
                                        "w-full rounded-lg pl-10 pr-4 py-2 cursor-pointer",
                                        "border border-border/80 dark:border-dark-border",
                                        "bg-card/70 dark:bg-dark-secondary/70",
                                        "text-card-foreground dark:text-dark-card-foreground",
                                        "placeholder:text-muted-foreground dark:placeholder:text-dark-muted-foreground",
                                        "focus:outline-none focus:ring-2 focus:ring-ring/50 dark:focus:ring-dark-ring/40",
                                    ].join(" ")}
                                />
                                <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-dark-muted-foreground" />
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-2">
                            {/* Theme toggle */}
                            <motion.button
                                type="button"
                                onClick={handleToggleTheme}
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-2 rounded-full text-muted-foreground dark:text-dark-muted-foreground hover:bg-card/60 dark:hover:bg-dark-secondary/60 hover:text-card-foreground dark:hover:text-dark-card-foreground transition-colors"
                                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                                title={isDark ? "Light mode" : "Dark mode"}
                            >
                                {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
                            </motion.button>

                            <NavLink
                                to="/wishlist"
                                onClick={closeUserMenu}
                                className="p-2 rounded-full text-muted-foreground dark:text-dark-muted-foreground hover:bg-card/60 dark:hover:bg-dark-secondary/60 hover:text-card-foreground dark:hover:text-dark-card-foreground relative transition-colors"
                            >
                                <FaHeart size={20} />
                                {wishlist.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground text-[10px] flex items-center justify-center">
                                        {wishlist.length}
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/cart"
                                onClick={closeUserMenu}
                                className="p-2 rounded-full text-muted-foreground dark:text-dark-muted-foreground hover:bg-card/60 dark:hover:bg-dark-secondary/60 hover:text-card-foreground dark:hover:text-dark-card-foreground relative transition-colors"
                            >
                                <FaShoppingCart size={20} />
                                {totalCartItems > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground text-[10px] flex items-center justify-center">
                                        {totalCartItems}
                                    </span>
                                )}
                            </NavLink>

                            {user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsUserMenuOpen((v) => !v)}
                                        className="flex items-center p-2 rounded-full hover:bg-card/60 dark:hover:bg-dark-secondary/60 transition-colors"
                                        aria-haspopup="menu"
                                        aria-expanded={isUserMenuOpen}
                                        aria-label="Open profile menu"
                                    >
                                        <img
                                            src={
                                                user.avatar?.url ||
                                                `https://ui-avatars.com/api/?name=${user.name}&background=6366F1&color=fff`
                                            }
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                                transition={{
                                                    duration: 0.18,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className="absolute right-0 mt-2 w-56 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-lg p-2 z-50"
                                                role="menu"
                                            >
                                                <NavItem to="/profile" icon={FaUser}>
                                                    Profile
                                                </NavItem>

                                                <NavItem to="/my-orders" icon={FaClipboardList}>
                                                    My Orders
                                                </NavItem>

                                                {user.role === "admin" && (
                                                    <>
                                                        <NavItem to="/admin" icon={FaTachometerAlt}>
                                                            Admin
                                                        </NavItem>
                                                        <NavItem to="/admin/subscribers" icon={FaEnvelopeOpenText}>
                                                            Subscribers
                                                        </NavItem>
                                                    </>
                                                )}

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium text-muted-foreground dark:text-dark-muted-foreground hover:bg-destructive/10 dark:hover:bg-dark-destructive/10 hover:text-destructive dark:hover:text-dark-destructive"
                                                    role="menuitem"
                                                    type="button"
                                                >
                                                    <FaSignOutAlt className="w-5 h-5" />
                                                    <span>Logout</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-4 py-2 bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 dark:hover:bg-dark-primary/90 transition-colors"
                                >
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                type="button"
                                onClick={openSearch}
                                className="p-2 rounded-xl text-muted-foreground dark:text-dark-muted-foreground hover:bg-card/60 dark:hover:bg-dark-secondary/60 transition-colors"
                                aria-label="Open search"
                            >
                                <FaSearch size={20} />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    closeUserMenu();
                                    setMenuOpen(true);
                                }}
                                className="p-2 rounded-xl text-muted-foreground dark:text-dark-muted-foreground hover:bg-card/60 dark:hover:bg-dark-secondary/60 transition-colors"
                                aria-label="Open menu"
                            >
                                <FaBars size={22} />
                            </button>
                        </div>
                    </div>
                </nav>
            </motion.header>

            <SearchModal
                open={isSearchOpen}
                keyword={keyword}
                setKeyword={setKeyword}
                onClose={closeSearch}
            >
                {trimmedKeyword ? (
                    <div>
                        {isSearching && (
                            <div className="px-6 py-6 space-y-4">
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-5 animate-pulse"
                                    >
                                        <div className="h-20 w-20 rounded-2xl bg-black/10 dark:bg-white/10" />
                                        <div className="flex-1">
                                            <div className="h-3 w-24 rounded bg-black/10 dark:bg-white/10" />
                                            <div className="mt-3 h-5 w-3/5 rounded bg-black/10 dark:bg-white/10" />
                                            <div className="mt-3 h-4 w-28 rounded bg-black/10 dark:bg-white/10" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isSearching && searchError && (
                            <div className="px-6 py-6 text-sm text-destructive">
                                {searchError}
                            </div>
                        )}

                        {!isSearching && !searchError && (
                            <>
                                {searchResults.length > 0 ? (
                                    <div>
                                        <AnimatePresence initial={false}>
                                            {searchResults.map((product) => (
                                                <SearchResult
                                                    key={product._id}
                                                    product={product}
                                                    onClose={handleResultClose}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div className="px-6 py-10">
                                        <div className="rounded-2xl border border-border dark:border-dark-border bg-card dark:bg-dark-card px-6 py-8 text-center">
                                            <p className="text-lg font-semibold text-text-primary dark:text-dark-card-foreground">
                                                No creations found
                                            </p>
                                            <p className="mt-2 text-sm text-text-secondary dark:text-dark-muted-foreground">
                                                We couldn't find any creations matching your search. Try another keyword.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <RecentSearches
                            searches={recentSearches}
                            onSelect={handleSelectSuggestion}
                            onRemove={(value) =>
                                setRecentSearches((prev) =>
                                    prev.filter((s) => s !== value)
                                )
                            }
                            onClear={() => setRecentSearches([])}
                        />

                        {PopularSearches && (
                            <PopularSearches onSelect={handleSelectSuggestion} />
                        )}
                    </>
                )}
            </SearchModal>

            {/* Mobile Menu (overlay + drawer) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={overlayVariants}
                            className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-[2px] md:hidden"
                            onMouseDown={(e) => {
                                if (e.target === e.currentTarget) closeMobileMenu();
                            }}
                            aria-hidden="true"
                        />

                        <motion.aside
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={drawerVariants}
                            className={[
                                "fixed inset-y-0 right-0 z-[61] md:hidden",
                                "w-[88vw] max-w-[420px]",
                                "bg-background dark:bg-dark-card",
                                "border-l border-border dark:border-dark-border",
                                "shadow-2xl",
                                "p-6",
                            ].join(" ")}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Mobile menu"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    {/* ✅ Drawer logo image opens preview */}
                                    <button
                                        type="button"
                                        onClick={openLogoPreview}
                                        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 dark:focus-visible:ring-dark-ring/40"
                                        aria-label="Preview logo"
                                        title="Preview logo"
                                    >
                                        <img
                                            src={BRAND_LOGO_SRC}
                                            alt={BRAND_NAME}
                                            className="h-10 w-10 rounded-full object-cover shadow-soft"
                                        />
                                    </button>

                                    {/* ✅ Drawer brand text goes home */}
                                    <Link
                                        to="/"
                                        className="text-2xl font-bold text-card-foreground dark:text-dark-card-foreground tracking-tighter"
                                        onClick={closeMobileMenu}
                                        aria-label={BRAND_NAME}
                                        title="Go to home"
                                    >
                                        {BRAND_NAME}
                                    </Link>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeMobileMenu}
                                    className="p-2 rounded-xl text-muted-foreground dark:text-dark-muted-foreground hover:bg-card/60 dark:hover:bg-dark-secondary/60 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <FaTimes size={22} />
                                </button>
                            </div>

                            {/* Quick counters row */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <Link
                                    to="/wishlist"
                                    onClick={closeMobileMenu}
                                    className="rounded-2xl border border-border dark:border-dark-border bg-card/70 dark:bg-dark-secondary/50 px-4 py-3 flex items-center justify-between"
                                >
                                    <span className="flex items-center gap-3 text-text-primary dark:text-dark-card-foreground font-semibold">
                                        <FaHeart />
                                        Wishlist
                                    </span>
                                    <span className="text-sm text-text-secondary dark:text-dark-muted-foreground">
                                        {wishlist.length}
                                    </span>
                                </Link>

                                <Link
                                    to="/cart"
                                    onClick={closeMobileMenu}
                                    className="rounded-2xl border border-border dark:border-dark-border bg-card/70 dark:bg-dark-secondary/50 px-4 py-3 flex items-center justify-between"
                                >
                                    <span className="flex items-center gap-3 text-text-primary dark:text-dark-card-foreground font-semibold">
                                        <FaShoppingCart />
                                        Cart
                                    </span>
                                    <span className="text-sm text-text-secondary dark:text-dark-muted-foreground">
                                        {totalCartItems}
                                    </span>
                                </Link>
                            </div>

                            {/* Theme toggle */}
                            <button
                                type="button"
                                onClick={handleToggleTheme}
                                className="mb-5 w-full flex items-center justify-between rounded-2xl border border-border dark:border-dark-border bg-card/70 dark:bg-dark-secondary/50 px-4 py-3 text-card-foreground dark:text-dark-card-foreground"
                            >
                                <span className="font-semibold">
                                    {isDark ? "Light Mode" : "Dark Mode"}
                                </span>
                                {isDark ? <FaSun /> : <FaMoon />}
                            </button>

                            <nav className="flex flex-col space-y-2">
                                <NavItem to="/" icon={FaHome}>
                                    Home
                                </NavItem>

                                <NavItem to="/cart" icon={FaShoppingCart}>
                                    Cart
                                </NavItem>

                                <NavItem to="/wishlist" icon={FaHeart}>
                                    Wishlist
                                </NavItem>

                                {user ? (
                                    <>
                                        <div className="my-2 h-px bg-border dark:bg-dark-border" />

                                        <NavItem to="/profile" icon={FaUser}>
                                            Profile
                                        </NavItem>

                                        <NavItem to="/my-orders" icon={FaClipboardList}>
                                            My Orders
                                        </NavItem>

                                        {user.role === "admin" && (
                                            <>
                                                <NavItem to="/admin" icon={FaTachometerAlt}>
                                                    Admin
                                                </NavItem>
                                                <NavItem to="/admin/subscribers" icon={FaEnvelopeOpenText}>
                                                    Subscribers
                                                </NavItem>
                                            </>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold text-muted-foreground dark:text-dark-muted-foreground hover:bg-destructive/10 dark:hover:bg-dark-destructive/10 hover:text-destructive dark:hover:text-dark-destructive transition-colors"
                                            type="button"
                                        >
                                            <FaSignOutAlt className="w-5 h-5" />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        className="mt-3 px-4 py-3 bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground rounded-2xl text-base font-semibold hover:bg-primary/90 dark:hover:bg-dark-primary/90 text-center transition-colors"
                                    >
                                        Login
                                    </Link>
                                )}
                            </nav>

                            <div className="mt-6 text-xs text-text-secondary dark:text-dark-muted-foreground leading-relaxed">
                                Handmade, thoughtfully crafted — with calm, careful details in every piece.
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ✅ Logo preview modal (medium size) */}
            <AnimatePresence>
                {isLogoPreviewOpen && (
                    <motion.div
                        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onMouseDown={(e) => {
                            if (e.target === e.currentTarget) closeLogoPreview();
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Logo preview"
                    >
                        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

                        <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.985 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.985 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full max-w-md rounded-[26px] border border-border/70 dark:border-dark-border bg-card dark:bg-dark-card shadow-2xl p-5"
                        >
                            <button
                                type="button"
                                onClick={closeLogoPreview}
                                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-border dark:border-dark-border bg-background/80 dark:bg-dark-secondary/60 text-text-primary dark:text-dark-card-foreground shadow-soft"
                                aria-label="Close logo preview"
                                title="Close"
                            >
                                <FaTimes />
                            </button>

                            <div className="rounded-2xl border border-border/60 dark:border-dark-border bg-background dark:bg-dark-secondary/30 p-6 flex items-center justify-center">
                                <img
                                    src={BRAND_LOGO_SRC}
                                    alt={BRAND_NAME}
                                    className="h-44 w-44 sm:h-56 sm:w-56 object-contain"
                                />
                            </div>

                            <p className="mt-4 text-center font-serif text-lg font-semibold text-text-primary dark:text-dark-card-foreground">
                                {BRAND_NAME}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;