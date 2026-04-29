import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldX, Loader2, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";

const ADMIN_EMAIL = "mythicalgamingstation@gmail.com";

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
  played_status?: boolean | null;
  created_at: string;
}

// Short notification beep using WebAudio (no external file needed)
const playNotificationSound = () => {
  try {
    const AudioCtx =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.42);
  } catch {
    /* ignore */
  }
};

const todayISO = () => new Date().toISOString().split("T")[0];

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const initialLoadRef = useRef(true);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;

    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setBookings(data as Booking[]);
      else if (error) console.error("Bookings fetch error:", error);
      setLoading(false);
      initialLoadRef.current = false;
    };
    fetchBookings();

    // Realtime subscription
    const channel = supabase
      .channel("admin-bookings-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          const newBooking = payload.new as Booking;
          setBookings((prev) => {
            if (prev.some((b) => b.id === newBooking.id)) return prev;
            return [newBooking, ...prev];
          });
          if (!initialLoadRef.current) {
            playNotificationSound();
            toast.success(`New booking: ${newBooking.name}`);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings" },
        (payload) => {
          const updated = payload.new as Booking;
          setBookings((prev) =>
            prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const togglePlayed = async (b: Booking) => {
    const next = !b.played_status;
    // Optimistic update
    setBookings((prev) =>
      prev.map((x) => (x.id === b.id ? { ...x, played_status: next } : x))
    );
    const { error } = await supabase
      .from("bookings")
      .update({ played_status: next } as any)
      .eq("id", b.id);
    if (error) {
      console.error("Failed to update played_status:", error);
      toast.error("Could not update status");
      // Revert
      setBookings((prev) =>
        prev.map((x) => (x.id === b.id ? { ...x, played_status: !next } : x))
      );
    }
  };

  const today = todayISO();
  const todaysCount = bookings.filter((b) => b.date === today).length;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-orange" size={40} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="pt-28 pb-8 section-padding">
        <div className="container mx-auto max-w-lg text-center">
          <ScrollReveal>
            <ShieldX size={56} className="mx-auto mb-6 text-red-500" />
            <h1 className="heading-xl mb-4">Access Denied</h1>
            <p className="subtitle">You do not have permission to view this page.</p>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 section-padding">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <h1 className="heading-xl text-center mb-2">Admin Dashboard</h1>
          <p className="subtitle text-center mb-10">
            Today's Bookings:{" "}
            <span className="text-brand-orange font-display font-bold">
              {todaysCount}
            </span>
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-orange" size={36} />
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-center text-muted-foreground">No bookings yet.</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/50">
                    {["✓", "Entry #", "Name", "Email", "Players", "Section", "Games", "Date", "Time", "Duration", "Phone", "Total", "Status"].map((h) => (
                      <th key={h} className="py-3 px-3 font-display text-xs tracking-widest uppercase text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <motion.tr
                      key={b.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      className={`border-b border-border/20 hover:bg-brand-orange/5 transition-colors ${b.played_status ? "opacity-70" : ""}`}
                    >
                      <td className="py-3 px-3">
                        <button
                          onClick={() => togglePlayed(b)}
                          className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                            b.played_status
                              ? "bg-green-500/20 border-green-500"
                              : "border-border hover:border-brand-orange"
                          }`}
                          title={b.played_status ? "Mark as not played" : "Mark as played"}
                        >
                          {b.played_status && <Check size={14} className="text-green-400" />}
                        </button>
                      </td>
                      <td className="py-3 px-3 font-display text-xs font-bold text-brand-orange">{b.id.slice(0, 8).toUpperCase()}</td>
                      <td className="py-3 px-3 text-sm text-primary">{b.name}</td>
                      <td className="py-3 px-3 text-sm text-muted-foreground">{b.email}</td>
                      <td className="py-3 px-3 text-sm text-primary text-center">{b.players}</td>
                      <td className="py-3 px-3 text-sm text-primary text-center">Section {String(b.cabin).padStart(2, "0")}</td>
                      <td className="py-3 px-3 text-xs text-muted-foreground max-w-[160px] truncate">{Array.isArray(b.games) ? b.games.join(", ") : b.games}</td>
                      <td className="py-3 px-3 text-sm text-primary">{b.date}</td>
                      <td className="py-3 px-3 text-sm text-primary">{b.time}</td>
                      <td className="py-3 px-3 text-sm text-primary text-center">{b.duration} min</td>
                      <td className="py-3 px-3 text-sm text-primary">{b.phone || "—"}</td>
                      <td className="py-3 px-3 font-display text-sm font-bold text-brand-orange">₹{b.total_price}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-md font-display tracking-wider border ${
                            b.played_status
                              ? "bg-green-500/10 text-green-400 border-green-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {b.played_status ? "Played" : "Not Played"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden space-y-4">
              {bookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="card-premium"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePlayed(b)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                          b.played_status
                            ? "bg-green-500/20 border-green-500"
                            : "border-border hover:border-brand-orange"
                        }`}
                      >
                        {b.played_status && <Check size={14} className="text-green-400" />}
                      </button>
                      <span className="font-display text-xs font-bold text-brand-orange tracking-widest">{b.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <span className="font-display text-lg font-bold text-brand-orange">₹{b.total_price}</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      ["Name", b.name],
                      ["Email", b.email],
                      ["Players", String(b.players)],
                      ["Section", `Section ${String(b.cabin).padStart(2, "0")}`],
                      ["Games", Array.isArray(b.games) ? b.games.join(", ") : b.games],
                      ["Date", b.date],
                      ["Time", b.time],
                      ["Duration", `${b.duration} min`],
                      ["Phone", b.phone || "—"],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between border-b border-border/20 pb-1">
                        <span className="text-muted-foreground text-xs">{l}</span>
                        <span className="text-primary text-xs font-semibold">{v}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-1">
                      <span className="text-muted-foreground text-xs">Status</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-display tracking-wider border ${
                          b.played_status
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {b.played_status ? "Played" : "Not Played"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
