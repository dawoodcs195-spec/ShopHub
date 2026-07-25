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

    const totalCartItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const closeUserMenu = useCallback(() => setIsUserMenuOpen(false), []);

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

    const menuVariants = {
        open: {
            x: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 },
        },
        closed: {
            x: "100%",
            transition: { type: "spring", stiffness: 300, damping: 30 },
        },
    };

    const NavItem = ({ to, children, icon: Icon }) => (
        <NavLink
            to={to}
            onClick={() => {
                setMenuOpen(false);
                closeUserMenu();
            }}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                        ? "bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground"
                        : "text-muted-foreground dark:text-dark-muted-foreground hover:bg-card dark:hover:bg-dark-card hover:text-card-foreground dark:hover:text-dark-card-foreground"
                }`
            }
        >
            <Icon className="w-5 h-5" />
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
                            <Link
                                to="/"
                                className="text-3xl font-bold text-card-foreground dark:text-dark-card-foreground tracking-tighter"
                                onClick={() => closeUserMenu()}
                            >
                                SHOPHUB
                            </Link>
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
                                aria-label={
                                    isDark
                                        ? "Switch to light mode"
                                        : "Switch to dark mode"
                                }
                                title={isDark ? "Light mode" : "Dark mode"}
                            >
                                {isDark ? (
                                    <FaSun size={18} />
                                ) : (
                                    <FaMoon size={18} />
                                )}
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
                                        onClick={() =>
                                            setIsUserMenuOpen((v) => !v)
                                        }
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
                                                initial={{
                                                    opacity: 0,
                                                    y: 8,
                                                    scale: 0.98,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: 8,
                                                    scale: 0.98,
                                                }}
                                                transition={{
                                                    duration: 0.18,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className="absolute right-0 mt-2 w-48 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-lg p-2 z-50"
                                                role="menu"
                                            >
                                                <NavItem
                                                    to="/profile"
                                                    icon={FaUser}
                                                >
                                                    Profile
                                                </NavItem>

                                                {user.role === "admin" && (
                                                    <NavItem
                                                        to="/admin"
                                                        icon={FaTachometerAlt}
                                                    >
                                                        Admin
                                                    </NavItem>
                                                )}

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium text-muted-foreground dark:text-dark-muted-foreground hover:bg-destructive/10 dark:hover:bg-dark-destructive/10 hover:text-destructive dark:hover:text-dark-destructive"
                                                    role="menuitem"
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
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => {
                                    closeUserMenu();
                                    setMenuOpen(true);
                                }}
                                className="p-2 rounded-md text-muted-foreground dark:text-dark-muted-foreground hover:bg-card/60 dark:hover:bg-dark-secondary/60 transition-colors"
                            >
                                <FaBars size={24} />
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
                                        <div className="h-20 w-20 rounded-2xl bg-slate-100" />
                                        <div className="flex-1">
                                            <div className="h-3 w-24 rounded bg-slate-100" />
                                            <div className="mt-3 h-5 w-3/5 rounded bg-slate-100" />
                                            <div className="mt-3 h-4 w-28 rounded bg-slate-100" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isSearching && searchError && (
                            <div className="px-6 py-6 text-sm text-red-600">
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
                                        <div className="rounded-2xl border border-slate-200 bg-[#FCFAF7] px-6 py-8 text-center">
                                            <p className="text-lg font-semibold text-[#2D2A26]">
                                                ✨ No creations found
                                            </p>
                                            <p className="mt-2 text-sm text-[#7A7067]">
                                                We couldn't find any creations
                                                matching your search. Try
                                                another keyword.
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

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-y-0 right-0 w-full max-w-sm bg-background dark:bg-dark-card p-6 z-50 md:hidden border-l border-border dark:border-dark-border"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <Link
                                to="/"
                                className="text-3xl font-bold text-card-foreground dark:text-dark-card-foreground tracking-tighter"
                                onClick={() => setMenuOpen(false)}
                            >
                                SHOPHUB
                            </Link>
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="p-2 rounded-md text-muted-foreground dark:text-dark-muted-foreground hover:bg-card/60 dark:hover:bg-dark-secondary/60 transition-colors"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <div className="relative mb-6">
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

                        {/* Mobile theme toggle */}
                        <button
                            type="button"
                            onClick={handleToggleTheme}
                            className="mb-6 w-full flex items-center justify-between rounded-2xl border border-border dark:border-dark-border bg-card/70 dark:bg-dark-secondary/70 px-4 py-3 text-card-foreground dark:text-dark-card-foreground"
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
                                    <hr className="border-border dark:border-dark-border my-2" />
                                    <NavItem to="/profile" icon={FaUser}>
                                        Profile
                                    </NavItem>
                                    {user.role === "admin" && (
                                        <NavItem to="/admin" icon={FaTachometerAlt}>
                                            Admin
                                        </NavItem>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium text-muted-foreground dark:text-dark-muted-foreground hover:bg-destructive/10 dark:hover:bg-dark-destructive/10 hover:text-destructive dark:hover:text-dark-destructive"
                                    >
                                        <FaSignOutAlt className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="mt-4 px-4 py-3 bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground rounded-lg text-base font-semibold hover:bg-primary/90 dark:hover:bg-dark-primary/90 text-center transition-colors"
                                >
                                    Login
                                </Link>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;