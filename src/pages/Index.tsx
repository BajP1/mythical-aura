import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gamepad2, Users, Shield, Sofa, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import logo from "@/assets/logo.jpeg";
import heroBg from "@/assets/hero-bg.jpg";
import cabinImg from "@/assets/cabin.jpg";
import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gallery3 from "@/assets/gallery3.jpg";

const features = [
  { icon: Gamepad2, title: "High-End Gaming Setup", desc: "PS5 consoles with 4K displays and premium audio systems for an immersive experience." },
  { icon: Shield, title: "Private Sections", desc: "Exclusive private gaming sections with ambient lighting." },
  { icon: Users, title: "Multiplayer Experience", desc: "Connect with friends in our dedicated multiplayer zones for epic gaming sessions." },
  { icon: Sofa, title: "Comfortable Lounge", desc: "Premium ergonomic chairs and a relaxing atmosphere to game for hours." },
];

const testimonials = [
  { name: "Arjun S.", text: "Best gaming lounge in Patiala! The PS5 setup is incredible and the private cabins are so comfortable.", rating: 5 },
  { name: "Priya M.", text: "Took my friends here for a birthday party. The multiplayer experience was absolutely amazing!", rating: 5 },
  { name: "Rahul K.", text: "Premium quality at affordable prices. The ambiance with neon lighting is next level.", rating: 5 },
  { name: "Simran D.", text: "Clean, well-maintained, and the staff is super friendly. We keep coming back every weekend!", rating: 5 },
];

const galleryImages = [heroBg, gallery1, gallery2, gallery3, cabinImg, gallery1];

const Index = () => {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Gaming lounge" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(43,43,43,0.7) 0%, rgba(43,43,43,0.85) 60%, hsl(0,0%,17%) 100%)" }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <img
              src={logo}
              alt="Mythical Gaming Station"
              className="mx-auto h-32 sm:h-40 md:h-48 rounded-2xl"
              style={{ filter: "drop-shadow(0 0 40px rgba(255,140,0,0.3))" }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="heading-xl mb-4"
          >
            Mythical Gaming Station
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="subtitle mb-10 text-lg md:text-2xl"
          >
            Experience Gaming Like Never Before
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link to="/book" className="btn-premium text-lg animate-pulse-glow">
              Book Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="container mx-auto">
          <ScrollReveal>
            <h2 className="heading-lg text-center mb-4">Why Gamers Choose Us</h2>
            <p className="subtitle text-center mb-16 max-w-2xl mx-auto">Premium facilities designed for the ultimate gaming experience</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.1}>
                <div className="card-premium text-center h-full">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(33,100%,50%,0.15), hsl(199,100%,50%,0.1))" }}>
                    <f.icon size={28} className="text-brand-orange" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-primary mb-3">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>


      {/* Urgency */}
      <section className="py-16">
        <ScrollReveal>
          <div className="container mx-auto text-center">
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block glass rounded-2xl px-8 py-6 glow-orange"
            >
              <p className="font-display text-xl md:text-2xl font-bold text-brand-orange tracking-wider">
                🔥 Limited Slots Available Today
              </p>
              <p className="text-muted-foreground mt-2 text-sm">Book now before all cabins are taken!</p>
            </motion.div>
          </div>
        </ScrollReveal>
      </section>

      {/* Gallery */}
      <section className="section-padding">
        <div className="container mx-auto">
          <ScrollReveal>
            <h2 className="heading-lg text-center mb-16">Gallery</h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setLightbox(i)}
                  className="aspect-video rounded-2xl overflow-hidden cursor-pointer relative group"
                >
                  <img src={img} alt={`Gallery ${i + 1}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" width={800} height={800} />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300" />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <img src={galleryImages[lightbox]} alt="" className="max-w-full max-h-[85vh] rounded-2xl object-contain" />
          </motion.div>
        )}
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto">
          <ScrollReveal>
            <h2 className="heading-lg text-center mb-16">What Gamers Say</h2>
          </ScrollReveal>

          <div className="relative max-w-2xl mx-auto">
            <div className="card-premium text-center py-10 px-8">
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[testimonialIdx].rating }, (_, i) => (
                  <Star key={i} size={20} className="text-brand-yellow fill-brand-yellow" />
                ))}
              </div>
              <p className="text-foreground text-lg leading-relaxed mb-6 italic">
                "{testimonials[testimonialIdx].text}"
              </p>
              <p className="font-display text-sm tracking-widest text-brand-orange">
                — {testimonials[testimonialIdx].name}
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setTestimonialIdx((p) => (p === 0 ? testimonials.length - 1 : p - 1))}
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-brand-orange transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === testimonialIdx ? "bg-brand-orange w-6" : "bg-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setTestimonialIdx((p) => (p === testimonials.length - 1 ? 0 : p + 1))}
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-brand-orange transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
