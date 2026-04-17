import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InstagramIcon, FacebookIcon, YouTubeIcon } from "@/components/SocialIcons";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.jpeg";

const ADMIN_EMAIL = "mythicalgamingstation@gmail.com";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/book", label: "Book Now" },
  { to: "/contact", label: "Contact" },
  { to: "/history", label: "History" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;
  const allLinks = isAdmin ? [...navLinks, { to: "/admin", label: "Admin" }] : navLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

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
          {allLinks.map((l) => (
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
            <a href="https://www.instagram.com/mythicalgamingstation?igsh=eXBmcWRwY3E5Z2Np" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><InstagramIcon size={20} /></a>
            <a href="https://www.facebook.com/share/18eB2vnZ6s/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FacebookIcon size={20} /></a>
            <a href="https://youtube.com/@mythicalgamingstation?feature=shared" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><YouTubeIcon size={20} /></a>
          </div>

          {/* Auth */}
          {!loading && (
            user ? (
              <div className="flex items-center gap-3 ml-4">
                <span className="font-display text-sm text-brand-orange tracking-wider">{displayName}</span>
                <button onClick={signOut} className="glass rounded-lg p-2 hover:bg-brand-orange/20 transition-colors" title="Sign out">
                  <LogOut size={16} className="text-muted-foreground" />
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="ml-4 flex items-center gap-2 glass rounded-xl px-4 py-2 font-display text-xs tracking-wider text-primary hover:border-brand-orange/50 transition-all border border-border/50"
              >
                <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.1 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.3 15.7 18.8 13 24 13c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.4 0-9.9-3.5-11.3-8.3l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.5 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/></svg>
                Login with Google
              </button>
            )
          )}
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
              {allLinks.map((l) => (
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

              {/* Mobile Auth */}
              {!loading && (
                user ? (
                  <div className="flex flex-col items-center gap-3">
                    <span className="font-display text-sm text-brand-orange">{displayName}</span>
                    <button onClick={signOut} className="glass rounded-lg px-4 py-2 font-display text-xs tracking-wider text-muted-foreground">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button onClick={signInWithGoogle} className="flex items-center gap-2 glass rounded-xl px-4 py-2 font-display text-xs tracking-wider text-primary border border-border/50">
                    <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.1 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.3 15.7 18.8 13 24 13c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.4 0-9.9-3.5-11.3-8.3l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.5 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/></svg>
                    Login with Google
                  </button>
                )
              )}

              <div className="flex gap-6 mt-4">
                <a href="https://www.instagram.com/mythicalgamingstation?igsh=eXBmcWRwY3E5Z2Np" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><InstagramIcon size={24} /></a>
                <a href="https://www.facebook.com/share/18eB2vnZ6s/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FacebookIcon size={24} /></a>
                <a href="https://youtube.com/@mythicalgamingstation?feature=shared" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><YouTubeIcon size={24} /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
