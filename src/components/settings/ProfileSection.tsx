import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ease = [0.16, 1, 0.3, 1] as const;

interface ProfileSectionProps {
  userId: string;
  firstName: string;
  setFirstName: (v: string) => void;
  email: string;
  currentWeight: number | null;
  setCurrentWeight: (v: number | null) => void;
  weightUnit: string;
  proteinTarget: number | null;
  setProteinTarget: (v: number | null) => void;
  injectionDay: string;
  setInjectionDay: (v: string) => void;
  avatarUrl: string | null;
  setAvatarUrl: (v: string | null) => void;
}

const DAYS_OF_WEEK = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

/** Resize image to max 200x200 and return a data URL */
const resizeImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 200;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ProfileSection = ({
  userId, firstName, setFirstName, email, currentWeight, setCurrentWeight,
  weightUnit, proteinTarget, setProteinTarget, injectionDay, setInjectionDay,
  avatarUrl, setAvatarUrl,
}: ProfileSectionProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await resizeImage(file);
      const { error } = await supabase.from("profiles").update({ avatar_url: dataUrl }).eq("user_id", userId);
      if (error) throw error;
      setAvatarUrl(dataUrl);
      toast.success("Avatar updated");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease }}
      className="bg-surface-container-lowest rounded-lg border border-border p-5 space-y-5"
    >
      <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Profile</span>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="relative w-16 h-16 rounded-full gradient-hero flex items-center justify-center shrink-0 overflow-hidden active:scale-95 transition-transform group"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-on-primary" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </button>
        <div>
          <p className="text-sm font-medium text-on-surface">{firstName || "Your Name"}</p>
          <p className="text-xs text-on-surface-variant">{uploading ? "Uploading…" : "Tap to change photo"}</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
      </div>

      {/* First Name */}
      <div>
        <label className="text-xs text-on-surface-variant mb-1.5 block">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Your name"
          className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/40 transition-colors"
        />
      </div>

      {/* Email (read-only) */}
      <div>
        <label className="text-xs text-on-surface-variant mb-1.5 block">Email</label>
        <div className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-3 text-sm text-on-surface-variant">
          {email || "—"}
        </div>
      </div>

      {/* Weight */}
      <div>
        <label className="text-xs text-on-surface-variant mb-1.5 block">Current Weight ({weightUnit})</label>
        <input
          type="number"
          value={currentWeight ?? ""}
          onChange={(e) => setCurrentWeight(e.target.value ? Number(e.target.value) : null)}
          placeholder={`Weight in ${weightUnit}`}
          className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/40 transition-colors"
        />
        <p className="text-[10px] text-on-surface-variant/60 mt-1">Updating weight recalculates your Muscle Score projection</p>
      </div>

      {/* Protein Target */}
      <div>
        <label className="text-xs text-on-surface-variant mb-1.5 block">Daily Protein Target (g)</label>
        <input
          type="number"
          value={proteinTarget ?? ""}
          onChange={(e) => setProteinTarget(e.target.value ? Number(e.target.value) : null)}
          placeholder="e.g. 120"
          className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/40 transition-colors"
        />
      </div>

      {/* Injection Day */}
      <div>
        <label className="text-xs text-on-surface-variant mb-2 block">Injection Day</label>
        <div className="grid grid-cols-4 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day.value}
              onClick={() => setInjectionDay(day.value)}
              className={`py-2.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-[0.95] ${
                injectionDay === day.value
                  ? "gradient-hero text-on-primary shadow-md"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-on-surface-variant/60 mt-1.5">Changing injection day adjusts all related notifications</p>
      </div>
    </motion.div>
  );
};

export default ProfileSection;
