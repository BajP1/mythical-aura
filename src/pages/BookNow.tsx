import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Home, Gamepad2, Calendar as CalendarIcon, Clock, Timer, CreditCard, ChevronLeft, ChevronRight, Check, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";

const STEPS = [
  { icon: Users, label: "Players" },
  { icon: Home, label: "Cabin" },
  { icon: Gamepad2, label: "Games" },
  { icon: CalendarIcon, label: "Date" },
  { icon: Clock, label: "Time" },
  { icon: Timer, label: "Duration" },
  { icon: Users, label: "Phone" },
  { icon: CreditCard, label: "Summary" },
];

const GAMES = ["FIFA 25", "GTA V", "Call of Duty", "WWE 2K25", "Spider-Man 2", "God of War Ragnarök", "Mortal Kombat", "Fortnite"];
const TIMES = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];

const BookNow = () => {
  const { user, signInWithGoogle } = useAuth();
  const [step, setStep] = useState(0);
  const [players, setPlayers] = useState(1);
  const [cabin, setCabin] = useState<number | null>(null);
  const [games, setGames] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const price = players * duration * 100;

  const toggleGame = (g: string) => {
    if (games.includes(g)) setGames(games.filter((x) => x !== g));
    else if (games.length < 3) setGames([...games, g]);
  };

  const canNext = () => {
    if (step === 0) return players >= 1;
    if (step === 1) return cabin !== null;
    if (step === 2) return games.length >= 1;
    if (step === 3) return date !== "";
    if (step === 4) return time !== "";
    if (step === 5) return duration >= 1;
    if (step === 6) return phone.trim().length >= 10;
    return true;
  };

  const handleConfirmBooking = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.from("bookings").insert({
        user_id: user.id,
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Guest",
        email: user.email || "",
        players,
        cabin,
        games,
        date,
        time,
        duration,
        phone,
        total_price: price,
      }).select("id").single();

      if (error) throw error;
      setBookingId(data.id);
      toast.success("Booking confirmed! 🎮");
    } catch (err: any) {
      toast.error(err.message || "Failed to save booking");
    } finally {
      setSaving(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  // If not logged in, show login prompt
  if (!user) {
    return (
      <div className="pt-28 pb-8 section-padding">
        <div className="container mx-auto max-w-lg text-center">
          <ScrollReveal>
            <LogIn size={48} className="mx-auto mb-6 text-brand-orange" />
            <h1 className="heading-xl mb-4">Please Login First</h1>
            <p className="subtitle mb-8">You need to sign in to book a gaming session</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={signInWithGoogle}
              className="btn-premium flex items-center gap-3 mx-auto text-lg"
            >
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.1 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.3 15.7 18.8 13 24 13c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.4 0-9.9-3.5-11.3-8.3l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.5 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/></svg>
              Login with Google
            </motion.button>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  // If booking confirmed, show confirmation
  if (bookingId) {
    return (
      <div className="pt-28 pb-8 section-padding">
        <div className="container mx-auto max-w-lg text-center">
          <ScrollReveal>
            <div className="w-20 h-20 rounded-full bg-brand-orange/20 flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-brand-orange" />
            </div>
            <h1 className="heading-xl mb-4">Booking Confirmed! 🎮</h1>
            <p className="subtitle mb-8">Your gaming session has been booked successfully</p>
            <div className="card-premium max-w-sm mx-auto mb-8">
              <p className="text-muted-foreground text-sm mb-1">Your Entry Number</p>
              <p className="font-display text-2xl font-bold text-brand-orange tracking-widest">{bookingId.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="card-premium max-w-sm mx-auto">
              <div className="space-y-3 text-left">
                {[
                  ["Players", `${players}`],
                  ["Cabin", `#${String(cabin).padStart(2, "0")}`],
                  ["Games", games.join(", ")],
                  ["Date", date],
                  ["Time", time],
                  ["Duration", `${duration}h`],
                  ["Phone", phone],
                  ["Total", `₹${price}`],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between border-b border-border/30 pb-2 last:border-0">
                    <span className="text-muted-foreground text-sm">{l}</span>
                    <span className="text-primary font-display text-sm font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  const stepContent = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h3 className="heading-md mb-2">How many players?</h3>
            <p className="text-muted-foreground mb-8">Select number of players (1-4)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <motion.button key={n} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPlayers(n)}
                  className={`card-premium text-center py-8 cursor-pointer ${players === n ? "border-brand-orange glow-orange" : ""}`}>
                  <span className="font-display text-4xl font-bold text-primary">{n}</span>
                  <span className="block text-muted-foreground text-sm mt-2">{n === 1 ? "Player" : "Players"}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <h3 className="heading-md mb-2">Choose your cabin</h3>
            <p className="text-muted-foreground mb-8">Select from our 10 premium private cabins</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <motion.button key={n} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCabin(n)}
                  className={`card-premium text-center py-6 cursor-pointer ${cabin === n ? "border-brand-orange glow-orange" : ""}`}>
                  <span className="font-display text-2xl font-bold text-primary">{String(n).padStart(2, "0")}</span>
                  <span className="block text-muted-foreground text-xs mt-1">Cabin</span>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="heading-md mb-2">Pick your games</h3>
            <p className="text-muted-foreground mb-8">Select 1 to 3 games ({games.length}/3 selected)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {GAMES.map((g) => (
                <motion.button key={g} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => toggleGame(g)}
                  className={`card-premium text-center py-6 cursor-pointer relative ${games.includes(g) ? "border-brand-orange glow-orange" : ""}`}>
                  {games.includes(g) && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center">
                      <Check size={12} className="text-primary-foreground" />
                    </div>
                  )}
                  <Gamepad2 size={24} className="mx-auto mb-2 text-brand-blue" />
                  <span className="font-display text-xs font-semibold text-primary">{g}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="heading-md mb-2">Select date</h3>
            <p className="text-muted-foreground mb-8">Choose your preferred gaming day</p>
            <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full max-w-sm mx-auto block glass rounded-xl px-6 py-4 text-primary font-display text-lg bg-transparent border border-border focus:border-brand-orange focus:outline-none transition-colors" />
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="heading-md mb-2">Select time</h3>
            <p className="text-muted-foreground mb-8">Pick a time slot</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              {TIMES.map((t) => (
                <motion.button key={t} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setTime(t)}
                  className={`card-premium text-center py-3 cursor-pointer ${time === t ? "border-brand-orange glow-orange" : ""}`}>
                  <span className="font-display text-sm text-primary">{t}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h3 className="heading-md mb-2">Duration</h3>
            <p className="text-muted-foreground mb-8">How long do you want to play?</p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[1, 2, 3].map((h) => (
                <motion.button key={h} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setDuration(h)}
                  className={`card-premium text-center py-8 cursor-pointer ${duration === h ? "border-brand-orange glow-orange" : ""}`}>
                  <span className="font-display text-3xl font-bold text-primary">{h}</span>
                  <span className="block text-muted-foreground text-sm mt-1">{h === 1 ? "Hour" : "Hours"}</span>
                </motion.button>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-muted-foreground text-sm">Price: ₹100 per player per hour</p>
              <p className="font-display text-3xl font-bold text-brand-orange mt-2">₹{price}</p>
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <h3 className="heading-md mb-2">Phone Number</h3>
            <p className="text-muted-foreground mb-8">Enter your phone number for booking confirmation</p>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 9876543210"
              className="w-full max-w-sm mx-auto block glass rounded-xl px-6 py-4 text-primary font-display text-lg bg-transparent border border-border focus:border-brand-orange focus:outline-none transition-colors" />
          </div>
        );
      case 7:
        return (
          <div>
            <h3 className="heading-md mb-8 text-center">Booking Summary</h3>
            <div className="card-premium max-w-md mx-auto">
              <div className="space-y-4">
                {[
                  ["Players", `${players} ${players === 1 ? "Player" : "Players"}`],
                  ["Cabin", cabin ? `Cabin ${String(cabin).padStart(2, "0")}` : "—"],
                  ["Games", games.join(", ") || "—"],
                  ["Date", date || "—"],
                  ["Time", time || "—"],
                  ["Duration", `${duration} ${duration === 1 ? "Hour" : "Hours"}`],
                  ["Phone", phone || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                    <span className="text-muted-foreground text-sm">{label}</span>
                    <span className="text-primary font-display text-sm font-semibold">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t border-brand-orange/30">
                  <span className="font-display text-lg text-primary">Total</span>
                  <span className="font-display text-3xl font-bold text-brand-orange">₹{price}</span>
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirmBooking}
                disabled={saving}
                className="btn-premium text-lg animate-pulse-glow disabled:opacity-50"
              >
                {saving ? "Saving..." : `Pay Now — ₹${price}`}
              </motion.button>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <section className="pt-28 pb-8 section-padding">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal>
            <h1 className="heading-xl text-center mb-4">Book Your Session</h1>
            <p className="subtitle text-center mb-12">Reserve your premium gaming cabin in just a few steps</p>
          </ScrollReveal>

          {/* Progress */}
          <div className="flex items-center justify-between mb-12 overflow-x-auto pb-4">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${i <= step ? "opacity-100" : "opacity-40"}`}
                  onClick={() => i < step && setStep(i)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${i === step ? "glow-orange" : ""} ${i < step ? "bg-brand-orange/20" : "glass"}`}
                    style={i === step ? { background: "linear-gradient(135deg, hsl(33,100%,50%), hsl(0,100%,62%))" } : {}}>
                    {i < step ? <Check size={18} className="text-brand-orange" /> : <s.icon size={18} className={i === step ? "text-foreground" : "text-muted-foreground"} />}
                  </div>
                  <span className={`text-xs mt-2 font-display tracking-wider hidden sm:block ${i === step ? "text-brand-orange" : "text-muted-foreground"}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-12 h-px mx-1 transition-colors duration-300 ${i < step ? "bg-brand-orange/50" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {stepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          {step < 6 && (
            <div className="flex justify-between mt-12">
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                className="glass rounded-xl px-6 py-3 font-display text-sm tracking-wider text-muted-foreground hover:text-primary disabled:opacity-30 transition-all flex items-center gap-2">
                <ChevronLeft size={16} /> Back
              </button>
              <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()}
                className="btn-premium flex items-center gap-2 disabled:opacity-30">
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BookNow;
