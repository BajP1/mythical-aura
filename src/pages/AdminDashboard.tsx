import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldX, Loader2, Check, CalendarDays, Clock, Users, Layers, Gamepad2, Phone, Timer, IndianRupee, Lock, Unlock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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

// Notification sound: try mp3 first, fallback to WebAudio beep
const playBeepFallback = () => {
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

const playNotificationSound = () => {
  try {
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => playBeepFallback());
  } catch {
    playBeepFallback();
  }
};

const todayISO = () => new Date().toISOString().split("T")[0];

const TIME_SLOTS = [
  "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM",
];

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const bookingIdsRef = useRef<Set<string>>(new Set());
  const hasLoadedBookingsRef = useRef(false);

  // Format Date -> YYYY-MM-DD using local time (matches <input type="date"> values)
  const toISODate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Set of dates that have at least one booking
  const bookedDateSet = useMemo(() => {
    const s = new Set<string>();
    bookings.forEach((b) => b.date && s.add(b.date));
    return s;
  }, [bookings]);

  const bookedDates = useMemo(
    () =>
      Array.from(bookedDateSet).map((d) => {
        const [y, m, day] = d.split("-").map(Number);
        return new Date(y, m - 1, day);
      }),
    [bookedDateSet]
  );

  const selectedDateISO = toISODate(selectedDate);
  const bookingsForSelected = useMemo(
    () =>
      bookings
        .filter((b) => b.date === selectedDateISO)
        .sort((a, b) => (a.time || "").localeCompare(b.time || "")),
    [bookings, selectedDateISO]
  );

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;
    let isMounted = true;

    const fetchBookings = async (notifyNew = false) => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (!isMounted) return;

      if (error) {
        console.error("Bookings fetch error:", error);
        setLoading(false);
        return;
      }

      const latestBookings = (data || []) as Booking[];
      const previousIds = bookingIdsRef.current;
      const newBookings = latestBookings.filter((b) => !previousIds.has(b.id));

      setBookings(latestBookings);
      bookingIdsRef.current = new Set(latestBookings.map((b) => b.id));
      setLoading(false);

      if (notifyNew && hasLoadedBookingsRef.current && newBookings.length > 0) {
        console.log("New booking detected by auto refresh:", newBookings);
        playNotificationSound();
        toast.success(
          newBookings.length === 1
            ? `New booking: ${newBookings[0].name}`
            : `${newBookings.length} new bookings received`
        );
      }

      hasLoadedBookingsRef.current = true;
    };

    fetchBookings(false);
    const intervalId = window.setInterval(() => fetchBookings(true), 3000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
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
  const isToday = selectedDateISO === today;
  const selectedLabel = selectedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const visibleBookings = bookingsForSelected;

  const handleSelectDate = (d?: Date) => {
    if (!d) return;
    setSelectedDate(d);
    setCalendarOpen(false);
  };

  const showToday = () => {
    setSelectedDate(new Date());
    setCalendarOpen(false);
  };

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
          <h1 className="heading-xl text-center mb-4">Admin Dashboard</h1>
          <div className="flex justify-center mb-4 gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setCalendarOpen(true)}
              className="glass rounded-xl px-5 py-2.5 font-display text-sm tracking-wider text-brand-orange border border-brand-orange/40 hover:bg-brand-orange/10 transition-all inline-flex items-center gap-2"
            >
              <CalendarDays size={16} />
              Calendar
            </motion.button>
            {!isToday && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={showToday}
                className="glass rounded-xl px-5 py-2.5 font-display text-sm tracking-wider text-primary border border-border hover:border-brand-orange/50 transition-all inline-flex items-center gap-2"
              >
                Show Today
              </motion.button>
            )}
          </div>
          <p className="subtitle text-center mb-10">
            Bookings for {isToday ? "Today" : selectedLabel}:{" "}
            <span className="text-brand-orange font-display font-bold">
              {visibleBookings.length}
            </span>
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-orange" size={36} />
          </div>
        ) : visibleBookings.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No bookings for {isToday ? "today" : selectedLabel}.
          </p>
        ) : (
          <>
            {/* Unified card grid (mobile + desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleBookings.map((b, i) => (
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
                    <div className="flex justify-between items-start border-b border-border/20 pb-1 gap-3">
                      <span className="text-muted-foreground text-xs shrink-0">Games</span>
                      <div className="text-primary text-xs font-semibold text-right whitespace-normal break-words">
                        {Array.isArray(b.games) ? (
                          <ul className="space-y-0.5 list-none">
                            {b.games.map((g, idx) => (
                              <li key={idx}>{g}</li>
                            ))}
                          </ul>
                        ) : (
                          <span>{b.games}</span>
                        )}
                      </div>
                    </div>
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

      {/* Calendar popup */}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="max-w-md glass border border-brand-orange/30 shadow-[0_0_40px_-10px_hsl(var(--brand-orange)/0.4)] rounded-2xl">
          <DialogTitle className="font-display text-lg tracking-wider text-brand-orange flex items-center gap-2">
            <CalendarDays size={18} />
            Pick a Date
          </DialogTitle>

          <div className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelectDate}
              modifiers={{ booked: bookedDates }}
              modifiersClassNames={{
                booked:
                  "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-brand-orange after:shadow-[0_0_6px_hsl(var(--brand-orange))]",
              }}
              className={cn("p-3 pointer-events-auto rounded-xl border border-border/40 bg-background/40")}
            />
          </div>

          <div className="flex justify-center mt-2">
            <button
              onClick={showToday}
              className="text-xs font-display tracking-wider text-brand-orange hover:underline"
            >
              Reset to Today
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
