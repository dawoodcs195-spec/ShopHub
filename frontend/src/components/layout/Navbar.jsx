// frontend/src/components/layout/Navbar.jsx

import { useState, useEffect, useRef } from "react";
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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [keyword, setKeyword] = useState("");

  const lastScrollY = useRef(0);
  const rafRef = useRef(null);

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const search = keyword.trim();
    if (search) {
      navigate(`/?keyword=${encodeURIComponent(search)}`);
    } else {
      navigate("/");
    }
    setMenuOpen(false);
  };

  useEffect(() => {
    lastScrollY.current = window.scrollY || 0;

    const handleScroll = () => {
      if (rafRef.current) return;

      rafRef.current = window.requestAnimationFrame(() => {
        const currentY = window.scrollY || 0;

        setScrolled(currentY > 10);

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
  }, [isMenuOpen]);

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
      onClick={() => setMenuOpen(false)}
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

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: isVisible ? 0 : "-110%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300",
          isScrolled
            ? // scrolled: glass + blur, but LIGHTER in dark mode
              "bg-background/85 dark:bg-dark-card/85 backdrop-blur-xl border-b border-border/70 dark:border-dark-border shadow-soft"
            : // top: slightly more solid
              "bg-background/95 dark:bg-dark-card/95 border-b border-transparent",
        ].join(" ")}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-3xl font-bold text-card-foreground dark:text-dark-card-foreground tracking-tighter"
              >
                SHOPHUB
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-grow max-w-xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className={[
                    "w-full rounded-lg pl-10 pr-4 py-2",
                    "border border-border/80 dark:border-dark-border",
                    // lighter surfaces:
                    "bg-card/70 dark:bg-dark-secondary/70",
                    "text-card-foreground dark:text-dark-card-foreground",
                    "placeholder:text-muted-foreground dark:placeholder:text-dark-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring/50 dark:focus:ring-dark-ring/40",
                  ].join(" ")}
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-dark-muted-foreground" />
              </form>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink
                to="/wishlist"
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
                <div className="relative group">
                  <button className="flex items-center p-2 rounded-full hover:bg-card/60 dark:hover:bg-dark-secondary/60 transition-colors">
                    <img
                      src={
                        user.avatar?.url ||
                        `https://ui-avatars.com/api/?name=${user.name}&background=6366F1&color=fff`
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 z-10">
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
                  </div>
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
                onClick={() => setMenuOpen(true)}
                className="p-2 rounded-md text-muted-foreground dark:text-dark-muted-foreground hover:bg-card/60 dark:hover:bg-dark-secondary/60 transition-colors"
              >
                <FaBars size={24} />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

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

            <form onSubmit={handleSearch} className="relative mb-8">
              <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className={[
                  "w-full rounded-lg pl-10 pr-4 py-2",
                  "border border-border/80 dark:border-dark-border",
                  "bg-card/70 dark:bg-dark-secondary/70",
                  "text-card-foreground dark:text-dark-card-foreground",
                  "placeholder:text-muted-foreground dark:placeholder:text-dark-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring/50 dark:focus:ring-dark-ring/40",
                ].join(" ")}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-dark-muted-foreground" />
            </form>

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