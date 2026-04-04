import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields before sending.");
      return;
    }
    const text = `Name: ${form.name}%0APhone: ${form.phone}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/918264004475?text=${encodeURIComponent(`Name: ${form.name}\nPhone: ${form.phone}\nMessage: ${form.message}`)}`, "_blank");
    toast.success("Redirecting to WhatsApp...");
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <div>
      <section className="pt-28 section-padding">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal>
            <h1 className="heading-xl text-center mb-4">Get In Touch</h1>
            <p className="subtitle text-center mb-16">We'd love to hear from you. Visit us or drop a message!</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Info */}
            <ScrollReveal>
              <div className="space-y-8">
                <div className="card-premium flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(33,100%,50%,0.15), hsl(199,100%,50%,0.1))" }}>
                    <MapPin size={22} className="text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-primary mb-1">Address</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">SCO 4, First Floor, PUDA Complex, Mini Secretariat Road, Patiala, Punjab, India</p>
                  </div>
                </div>

                <div className="card-premium flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(33,100%,50%,0.15), hsl(199,100%,50%,0.1))" }}>
                    <Phone size={22} className="text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-primary mb-1">Phone</h4>
                    <a href="tel:+918264004475" className="text-muted-foreground text-sm hover:text-brand-orange transition-colors">+91 8264004475</a>
                  </div>
                </div>

                <div className="card-premium flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(33,100%,50%,0.15), hsl(199,100%,50%,0.1))" }}>
                    <Mail size={22} className="text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-primary mb-1">WhatsApp</h4>
                    <a href="https://wa.me/918264004475" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-brand-green transition-colors">Chat with us on WhatsApp</a>
                  </div>
                </div>

                {/* Map */}
                <div className="rounded-2xl overflow-hidden border border-border/30 h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3440.0!2d76.39!3d30.34!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDIwJzI0LjAiTiA3NsKwMjMnMjQuMCJF!5e0!3m2!1sen!2sin!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                    allowFullScreen
                    loading="lazy"
                    title="Location"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal delay={0.2}>
              <form onSubmit={handleSubmit} className="card-premium space-y-6">
                <h3 className="heading-md mb-2">Send us a message</h3>
                <div>
                  <label className="font-display text-xs tracking-wider text-muted-foreground uppercase block mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-3 bg-transparent border border-border focus:border-brand-orange focus:outline-none transition-colors text-foreground"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="font-display text-xs tracking-wider text-muted-foreground uppercase block mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-3 bg-transparent border border-border focus:border-brand-orange focus:outline-none transition-colors text-foreground"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="font-display text-xs tracking-wider text-muted-foreground uppercase block mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-3 bg-transparent border border-border focus:border-brand-orange focus:outline-none transition-colors text-foreground resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-premium w-full flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Send Message
                </motion.button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
