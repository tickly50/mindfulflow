import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Heart, BookOpen, BarChart3, Wind, Trophy, Sparkles } from "lucide-react";
import GlassCard from "../common/GlassCard";
import BackgroundAurora from "../Layout/BackgroundAurora";
import FloatingParticles from "../Layout/FloatingParticles";
import { usePwaInstallPrompt } from "../../hooks/usePwaInstallPrompt";
import { variants } from "../../utils/animations";

const features = [
  {
    icon: Heart,
    title: "Denní check-in",
    text: "Zaznamenej náladu, spánek a kontext dne — rychle a bez přehlcení.",
  },
  {
    icon: BookOpen,
    title: "Deník",
    text: "Piš si poznámky u záznamů a sleduj svůj tok v čase.",
  },
  {
    icon: BarChart3,
    title: "Statistiky a trendy",
    text: "Přehledy, grafy a kalendář, aby bylo vidět, jak se daří.",
  },
  {
    icon: Wind,
    title: "Dýchací cvičení",
    text: "Krátké dechové sekvence přímo v aplikaci pro zklidnění.",
  },
  {
    icon: Trophy,
    title: "Achievementy",
    text: "Jemná motivace za pravidelnost — bez tlaku na výkon.",
  },
];

export default function InstallLanding() {
  const { canPromptInstall, promptInstall } = usePwaInstallPrompt();
  const [showManualHint, setShowManualHint] = useState(false);

  const handleDownload = async () => {
    if (canPromptInstall) {
      setShowManualHint(false);
      await promptInstall();
      return;
    }
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const el = document.getElementById("install-fallback");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (!ios) setShowManualHint(true);
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] flex flex-col relative overflow-x-hidden pt-safe font-sans">
      <BackgroundAurora currentMood={null} />
      <FloatingParticles />

      <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-10 sm:py-14 flex flex-col flex-1">
        <motion.div
          variants={variants.container}
          initial="hidden"
          animate="show"
          className="text-center mb-8"
        >
          <motion.div
            variants={variants.item}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/85 mb-5 shadow-depth-sm backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300/90" aria-hidden />
            MindfulFlow
          </motion.div>
          <motion.h1
            variants={variants.item}
            className="font-display text-3xl sm:text-[2.35rem] font-extrabold tracking-tight text-white mb-4 bg-gradient-to-br from-white via-violet-100 to-fuchsia-200/90 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(139,92,246,0.35)]"
          >
            Péče o náladu v&nbsp;jedné aplikaci
          </motion.h1>
          <motion.p
            variants={variants.item}
            className="text-white/65 text-[15px] leading-relaxed max-w-md mx-auto"
          >
            MindfulFlow je tvůj klidný prostor pro sledování nálady, deník a přehledy — data zůstávají u tebe
            lokálně. <span className="text-white/90">V běžné záložce prohlížeče aplikaci nespustíš</span> — funguje
            jen jako nainstalovaná PWA (ikona na ploše nebo v menu aplikací).
          </motion.p>
        </motion.div>

        <motion.div
          variants={variants.container}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <motion.div variants={variants.item}>
            <GlassCard className="p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300/95 mb-5 font-display">
                Co v aplikaci najdeš
              </p>
              <ul className="space-y-4">
                {features.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-3 group/item">
                    <span className="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-white/12 to-white/5 flex items-center justify-center border border-white/15 shadow-depth-sm transition-transform duration-300 group-hover/item:scale-110 group-hover/item:border-violet-400/40">
                      <Icon className="w-5 h-5 text-violet-200" aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold text-white text-sm font-display">{title}</p>
                      <p className="text-white/55 text-sm leading-snug mt-0.5">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </motion.div>

        <motion.div
          variants={variants.container}
          initial="hidden"
          animate="show"
          className="mt-auto space-y-4"
        >
          <motion.button
            variants={variants.item}
            type="button"
            onClick={handleDownload}
            whileHover={{ scale: 1.02, boxShadow: "0 0 48px rgba(139, 92, 246, 0.45)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_100%] hover:bg-right text-white font-bold text-base shadow-depth-lg border border-white/10 transition-[background-position] duration-500 ease-out"
          >
            <Download className="w-5 h-5" aria-hidden />
            Stáhnout aplikaci
          </motion.button>
          <motion.p variants={variants.item} className="text-center text-white/45 text-xs leading-relaxed">
            Po instalaci spusť MindfulFlow z ikony na ploše nebo v menu aplikací — tam poběží v plném režimu.
          </motion.p>

          {showManualHint && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-amber-200/90 text-xs leading-relaxed rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2"
            >
              V tomto prohlížeči nemusí být instalace k dispozici. Zkus Chrome nebo Edge, případně v menu prohlížeče
              zvol „Instalovat aplikaci“ nebo „Přidat na plochu“.
            </motion.p>
          )}

          <motion.div
            variants={variants.item}
            id="install-fallback"
            className="rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-md px-4 py-3 text-sm text-white/60 shadow-depth-sm"
          >
            <p className="font-medium text-white/80 mb-1">iPhone nebo iPad (Safari)</p>
            <p>
              Klepni na tlačítko Sdílet{" "}
              <span className="whitespace-nowrap text-white/70">(čtverec se šipkou)</span>, zvol{" "}
              <strong className="text-white/90 font-semibold">Přidat na plochu</strong> a potvrď.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
