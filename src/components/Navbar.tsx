import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InstagramIcon, FacebookIcon, YouTubeIcon } from "@/components/SocialIcons";
import logo from "@/assets/logo.jpeg";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/book", label: "Book Now" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-navbar shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Mythical Gaming Station" className="h-12 rounded-lg" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`relative font-display text-sm tracking-widest uppercase transition-colors duration-300 hover:text-brand-orange ${
                location.pathname === l.to ? "text-brand-orange" : "text-primary"
              } after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-brand-orange after:transition-all after:duration-300 ${
                location.pathname === l.to ? "after:w-full" : "after:w-0 hover:after:w-full"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 ml-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><InstagramIcon size={20} /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FacebookIcon size={20} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><YouTubeIcon size={20} /></a>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-primary"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-navbar overflow-hidden"
          >
            <div className="flex flex-col items-center gap-6 py-8">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`font-display text-lg tracking-widest uppercase ${
                    location.pathname === l.to ? "text-brand-orange" : "text-primary"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-6 mt-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><InstagramIcon size={24} /></a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FacebookIcon size={24} /></a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><YouTubeIcon size={24} /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
