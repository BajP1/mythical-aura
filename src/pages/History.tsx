import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Calendar, Clock, Users, Layers, Gamepad2, Timer, IndianRupee, Copy, Repeat, LogIn, History as HistoryIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";

interface Booking {
  id: string;
  name: string;
  email: string;
  players: number;
  cabin: number;
  games: string[];
  date: string;
  time: string;
  duration: number;
  phone: string;
  total_price: number;
  payment_status?: string | null;
  played_status?: boolean | null;
  created_at: string;
}

const formatDuration = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h} hr ${m} min`;
  if (h) return `${h} hr`;
  return `${m} min`;
};

const formatPlayers = (b: Booking) => {
  const games = b.games?.join(" ").toLowerCase() || "";
  if (games.includes("car wheel")) return `Car Wheel (${b.players}P)`;
  if (games.includes("vr")) return "VR Experience";
  return `${b.players} Player${b.players > 1 ? "s" : ""}`;
};

const History = () => {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchBookings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("History fetch error:", error);
        toast.error("Failed to load bookings");
      } else if (data) {
        setBookings(data as Booking[]);
      }
      setLoading(false);
    };
    fetchBookings();

    // Realtime: reflect admin updates (e.g. played_status) instantly
    const channel = supabase
      .channel(`history-bookings-${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const updated = payload.new as Booking;
          setBookings((prev) => prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleCopy = (b: Booking) => {
    const text = [
      `Mythical Gaming Station — Booking`,
      `Date: ${b.date}`,
      `Time: ${b.time}`,
      `Players: ${formatPlayers(b)}`,
      `Section: ${b.cabin}`,
      `Games: ${b.games?.join(", ") || "-"}`,
      `Duration: ${formatDuration(b.duration)}`,
      `Total: ₹${b.total_price}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Booking details copied");
  };

  const handleRepeat = (b: Booking) => {
    sessionStorage.setItem("repeat_booking", JSON.stringify(b));
    navigate("/book");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-orange" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-md">
          <ScrollReveal>
            <div className="glass rounded-2xl p-10 text-center border border-border/50">
              <HistoryIcon className="mx-auto mb-4 text-brand-orange" size={48} />
              <h1 className="heading-md mb-3">Your Booking History</h1>
              <p className="text-muted-foreground mb-6">
                Please login with Google to view your bookings
              </p>
              <button
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-2 glass rounded-xl px-5 py-3 font-display text-sm tracking-wider text-primary hover:border-brand-orange/50 transition-all border border-border/50"
              >
                <LogIn size={18} />
                Login with Google
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <ScrollReveal>
          <h1 className="heading-xl text-center mb-2">Your Bookings</h1>
          <p className="subtitle text-center mb-10">
            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-brand-orange" size={36} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center border border-border/50">
            <p className="text-muted-foreground text-lg">No bookings yet</p>
            <button
              onClick={() => navigate("/book")}
              className="mt-5 inline-flex items-center gap-2 glass rounded-xl px-5 py-3 font-display text-sm tracking-wider text-brand-orange border border-brand-orange/40 hover:bg-brand-orange/10 transition-all"
            >
              Book Your First Session
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {bookings.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-6 border border-border/50 hover:border-brand-orange/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsl(var(--brand-orange)/0.4)] group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-brand-orange font-display text-sm tracking-wider">
                      <Calendar size={14} />
                      {b.date}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mt-1">
                      <Clock size={12} />
                      {b.time}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-display tracking-wider border ${
                        b.played_status
                          ? "bg-green-500/10 text-green-400 border-green-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {b.played_status ? "Played" : "Not Played"}
                    </span>
                    {b.payment_status && (
                      <span className="text-[10px] glass px-2 py-0.5 rounded-md uppercase tracking-wider text-brand-orange border border-brand-orange/30">
                        {b.payment_status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-primary">
                    <Users size={14} className="text-muted-foreground" />
                    {formatPlayers(b)}
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Layers size={14} className="text-muted-foreground" />
                    Section {b.cabin}
                  </div>
                  <div className="flex items-start gap-2 text-primary">
                    <Gamepad2 size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                    {Array.isArray(b.games) && b.games.length > 0 ? (
                      <ul className="text-muted-foreground space-y-0.5 list-none break-words">
                        {b.games.map((g, idx) => (
                          <li key={idx} className="leading-snug">{g}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Timer size={14} className="text-muted-foreground" />
                    {formatDuration(b.duration)}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1 text-brand-orange font-display text-xl">
                    <IndianRupee size={18} />
                    {b.total_price}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(b)}
                      className="glass rounded-lg p-2 hover:bg-brand-orange/10 transition-colors border border-border/50"
                      title="Copy details"
                    >
                      <Copy size={14} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleRepeat(b)}
                      className="glass rounded-lg px-3 py-2 hover:bg-brand-orange/10 transition-colors border border-border/50 flex items-center gap-1.5 text-xs font-display tracking-wider text-brand-orange"
                      title="Repeat booking"
                    >
                      <Repeat size={12} />
                      Repeat
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
