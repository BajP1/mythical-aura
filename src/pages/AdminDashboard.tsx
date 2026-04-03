import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldX, Loader2, Users, Home, Gamepad2, CalendarIcon, Clock, Timer, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ScrollReveal from "@/components/ScrollReveal";

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
  created_at: string;
}

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      console.log("Admin bookings response:", { data, error });
      if (!error && data) setBookings(data as Booking[]);
      else if (error) console.error("Bookings fetch error:", error);
      setLoading(false);
    };
    fetchBookings();
  }, [isAdmin]);

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
          <p className="subtitle text-center mb-10">{bookings.length} total bookings</p>
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
                    {["Entry #", "Name", "Email", "Players", "Cabin", "Games", "Date", "Time", "Duration", "Total"].map((h) => (
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
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/20 hover:bg-brand-orange/5 transition-colors"
                    >
                      <td className="py-3 px-3 font-display text-xs font-bold text-brand-orange">{b.id.slice(0, 8).toUpperCase()}</td>
                      <td className="py-3 px-3 text-sm text-primary">{b.name}</td>
                      <td className="py-3 px-3 text-sm text-muted-foreground">{b.email}</td>
                      <td className="py-3 px-3 text-sm text-primary text-center">{b.players}</td>
                      <td className="py-3 px-3 text-sm text-primary text-center">#{String(b.cabin).padStart(2, "0")}</td>
                      <td className="py-3 px-3 text-xs text-muted-foreground max-w-[160px] truncate">{Array.isArray(b.games) ? b.games.join(", ") : b.games}</td>
                      <td className="py-3 px-3 text-sm text-primary">{b.date}</td>
                      <td className="py-3 px-3 text-sm text-primary">{b.time}</td>
                      <td className="py-3 px-3 text-sm text-primary text-center">{b.duration}h</td>
                      <td className="py-3 px-3 font-display text-sm font-bold text-brand-orange">₹{b.total_price}</td>
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
                  transition={{ delay: i * 0.05 }}
                  className="card-premium"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-display text-xs font-bold text-brand-orange tracking-widest">{b.id.slice(0, 8).toUpperCase()}</span>
                    <span className="font-display text-lg font-bold text-brand-orange">₹{b.total_price}</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      ["Name", b.name],
                      ["Email", b.email],
                      ["Players", String(b.players)],
                      ["Cabin", `#${String(b.cabin).padStart(2, "0")}`],
                      ["Games", Array.isArray(b.games) ? b.games.join(", ") : b.games],
                      ["Date", b.date],
                      ["Time", b.time],
                      ["Duration", `${b.duration}h`],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between border-b border-border/20 pb-1">
                        <span className="text-muted-foreground text-xs">{l}</span>
                        <span className="text-primary text-xs font-semibold">{v}</span>
                      </div>
                    ))}
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
