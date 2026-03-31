import { Link } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";
import { InstagramIcon, FacebookIcon, YouTubeIcon } from "@/components/SocialIcons";
import logo from "@/assets/logo.jpeg";

const Footer = () => (
  <footer className="border-t border-border/30 bg-secondary/50">
    <div className="container mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col items-start gap-4">
          <img src={logo} alt="Mythical Gaming Station" className="h-16 rounded-lg" />
          <p className="subtitle text-sm max-w-xs">
            Experience Gaming Like Never Before. Patiala's premier luxury gaming lounge.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-display text-sm tracking-widest uppercase text-primary">Quick Links</h4>
          {["/", "/about", "/book", "/contact"].map((to, i) => (
            <Link key={to} to={to} className="text-muted-foreground hover:text-brand-orange transition-colors text-sm">
              {["Home", "About", "Book Now", "Contact"][i]}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-display text-sm tracking-widest uppercase text-primary">Contact</h4>
          <div className="flex items-start gap-2 text-muted-foreground text-sm">
            <MapPin size={16} className="mt-0.5 shrink-0" />
            <span>SCO 4, First Floor, PUDA Complex, Mini Secretariat Road, Patiala, Punjab</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Phone size={16} className="shrink-0" />
            <a href="tel:+918264004475" className="hover:text-brand-orange transition-colors">+91 8264004475</a>
          </div>
          <div className="flex gap-4 mt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><InstagramIcon size={22} /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FacebookIcon size={22} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><YouTubeIcon size={22} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/30 mt-12 pt-8 text-center">
        <p className="text-muted-foreground text-xs tracking-wider">
          © {new Date().getFullYear()} Mythical Gaming Station. A Venture of Mythical Gaming Solutions LLP. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
