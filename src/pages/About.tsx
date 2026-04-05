import { Gamepad2, Shield, DollarSign, Tv, Headphones, Zap } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import heroBg from "@/assets/hero-bg.jpg";
import aboutLounge from "@/assets/about-lounge.jpg";

const whyUs = [
  { icon: Gamepad2, title: "Premium PS5 Consoles", desc: "Latest PlayStation 5 with DualSense controllers for the ultimate gaming experience." },
  { icon: Shield, title: "Private Gaming Cabins", desc: "10 exclusive cabins with soundproofing, ambient lighting, and personal comfort." },
  { icon: DollarSign, title: "Affordable Luxury", desc: "Premium experience starting at just ₹100/hour. Luxury gaming doesn't have to break the bank." },
];

const equipment = [
  { icon: Tv, title: "4K HDR Displays", desc: "Ultra-high definition screens for crystal-clear visuals." },
  { icon: Headphones, title: "Premium Audio", desc: "High-fidelity headsets for immersive soundscapes." },
  { icon: Zap, title: "PS5 Performance", desc: "Lightning-fast load times with SSD technology." },
];

const About = () => (
  <div>
    {/* Hero */}
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(43,43,43,0.8), hsl(0,0%,17%))" }} />
      </div>
      <div className="relative z-10 text-center px-4">
        <h1 className="heading-xl mb-4">Our Story</h1>
        <p className="subtitle max-w-2xl mx-auto">Born from a passion for gaming, Mythical Gaming Station is Patiala's first luxury gaming lounge experience.</p>
      </div>
    </section>

    {/* Story */}
    <section className="section-padding">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div>
              <h2 className="heading-lg mb-6">More Than Just Gaming</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Mythical Gaming Station was founded with a simple vision — to bring world-class gaming experiences to Patiala. We believe gaming is more than just a hobby; it's a culture, a community, and an escape into incredible worlds.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our 10 private cabins, each equipped with the latest PS5 consoles and 4K displays, offer an unparalleled gaming experience. Whether you're a casual gamer or a competitive player, our lounge provides the perfect environment to play, connect, and create unforgettable memories.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="rounded-2xl overflow-hidden glow-blue">
              <img src={aboutLounge} alt="Gaming lounge" loading="lazy" className="w-full h-80 object-cover" width={3840} height={2160} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto">
        <ScrollReveal>
          <h2 className="heading-lg text-center mb-16">Why Choose Us</h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-3 gap-6">
          {whyUs.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <div className="card-premium text-center h-full">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(33,100%,50%,0.15), hsl(199,100%,50%,0.1))" }}>
                  <item.icon size={28} className="text-brand-orange" />
                </div>
                <h3 className="font-display text-lg font-semibold text-primary mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Equipment */}
    <section className="section-padding">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div className="rounded-2xl overflow-hidden glow-orange">
              <img src={aboutLounge} alt="Gaming lounge" loading="lazy" className="w-full h-80 object-cover" width={3840} height={2160} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div>
              <h2 className="heading-lg mb-8">Our Equipment</h2>
              <div className="flex flex-col gap-6">
                {equipment.map((e) => (
                  <div key={e.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(199,100%,50%,0.15), hsl(33,100%,50%,0.1))" }}>
                      <e.icon size={22} className="text-brand-blue" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-semibold text-primary mb-1">{e.title}</h4>
                      <p className="text-muted-foreground text-sm">{e.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  </div>
);

export default About;
