import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Layers,
  Gamepad2,
  Calendar as CalendarIcon,
  Clock,
  Timer,
  Phone,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Check,
  LogIn,
  Glasses,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";
import {
  type PlayerType,
  getSectionsForPlayerType,
  getOptionForSection,
  getGamesForSelection,
  getPriceAndDuration,
} from "@/data/bookingData";

const STEPS = [
  { icon: Users, label: "Players" },
  { icon: Layers, label: "Section" },
  { icon: Gamepad2, label: "Games" },
  { icon: CalendarIcon, label: "Date" },
  { icon: Clock, label: "Time" },
  { icon: Timer, label: "Duration" },
  { icon: Phone, label: "Phone" },
  { icon: CreditCard, label: "Summary" },
];

const TIMES = [
  "11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM",
  "4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM"
];

const HOUR_OPTIONS = [1, 2, 3, 4];
const MINUTE_OPTIONS = [0, 30];

const PLAYER_OPTIONS: { value: PlayerType; label: string; sub: string; isVR?: boolean }[] = [
  { value: 1, label: "1", sub: "Player" },
  { value: 2, label: "2", sub: "Players" },
  { value: 3, label: "3", sub: "Players" },
  { value: 4, label: "4", sub: "Players" },
  { value: "vr", label: "VR", sub: "Experience", isVR: true },
];

const BookNow = () => {
  const { user, signInWithGoogle } = useAuth();

  const [step, setStep] = useState(0);
  const [playerType, setPlayerType] = useState<PlayerType | null>(null);
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [games, setGames] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [durationHours, setDurationHours] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const totalDuration = durationHours * 60 + durationMinutes;

  const basePrice =
    sectionId && playerType
      ? getPriceAndDuration(sectionId, playerType)?.price || 0
      : 0;

  const baseDuration =
    sectionId && playerType
      ? getPriceAndDuration(sectionId, playerType)?.duration || 60
      : 60;

  const pricePerMinute = basePrice / baseDuration;
  const price = Math.round(pricePerMinute * totalDuration);

  const availableSections = playerType
    ? getSectionsForPlayerType(playerType)
    : [];

  const availableGames =
    sectionId && playerType
      ? getGamesForSelection(sectionId, playerType)
      : [];

  const toggleGame = (g: string) => {
    if (games.includes(g)) setGames(games.filter(x => x !== g));
    else if (games.length < 3) setGames([...games, g]);
  };

  const canNext = () => {
    if (step === 0) return !!playerType;
    if (step === 1) return !!sectionId;
    if (step === 2) return games.length > 0;
    if (step === 3) return date !== "";
    if (step === 4) return time !== "";
    if (step === 6) return phone.length >= 10;
    return true;
  };

  const handleConfirmBooking = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const playersNum = playerType === "vr" ? 1 : playerType!;

      // 1. Save booking
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        name: user.user_metadata?.full_name || "Guest",
        email: user.email,
        players: playersNum,
        cabin: sectionId,
        games,
        date,
        time,
        duration: totalDuration,
        phone,
        total_price: price,
      });

      if (error) throw error;

      // 2. CREATE ORDER (FIXED ENDPOINT HERE)
      const response = await fetch(
        "https://czjrlnpckeeejakcumkb.supabase.co/functions/v1/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: price,
            customer_phone: phone,
            customerName:
              user.user_metadata?.full_name || "Guest",
            customerEmail: user.email || "guest@example.com",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment failed");
      }

      const sessionId = data.payment_session_id;

      if (!sessionId) {
        throw new Error("Missing payment session");
      }

      // 3. Redirect Cashfree
      window.location.href =
        `https://payments.cashfree.com/pg/view/payment?payment_session_id=${sessionId}`;

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-28 text-center">
        <LogIn className="mx-auto mb-3" />
        <button onClick={signInWithGoogle}>
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        Book Your Session
      </h1>

      <div className="border rounded-xl p-6">
        <p className="mb-4">Step {step + 1}</p>

        {step === 0 && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: "vr", label: "VR" },
            ].map(p => (
              <button
                key={String(p.value)}
                onClick={() => setPlayerType(p.value as PlayerType)}
                className="border p-2"
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div>
            {availableSections.map(s => (
              <button
                key={s.id}
                onClick={() => setSectionId(s.id)}
                className="border p-2 m-1"
              >
                Section {s.id}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            {availableGames.map(g => (
              <button
                key={g}
                onClick={() => toggleGame(g)}
                className="border p-2 m-1"
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        )}

        {step === 4 && (
          <div>
            {TIMES.map(t => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className="block border m-1 p-1"
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {step === 5 && (
          <p>Duration: {durationHours}h {durationMinutes}m</p>
        )}

        {step === 6 && (
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Phone"
          />
        )}

        {step === 7 && (
          <div>
            <p>Total: ₹{price}</p>
            <button onClick={handleConfirmBooking} disabled={saving}>
              {saving ? "Processing..." : "Pay Now"}
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-5">
        <button disabled={step === 0} onClick={() => setStep(step - 1)}>
          Back
        </button>

        <button
          disabled={!canNext()}
          onClick={() => setStep(step + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookNow;
