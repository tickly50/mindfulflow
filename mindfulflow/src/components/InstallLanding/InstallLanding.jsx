import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Heart, BookOpen, BarChart3, Wind, Trophy, Sparkles } from "lucide-react";
import GlassCard from "../common/GlassCard";
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
    <div className="min-h-[100dvh] bg-theme-bg flex flex-col relative overflow-x-hidden pt-safe font-sans">
      <div className="relative z-10 w-full max-w-prose-narrow mx-auto px-[var(--container-pad-x)] py-[clamp(1.5rem,6vh,3.5rem)] flex flex-col flex-1 min-w-0">
        <motion.div
          variants={variants.container}
          initial="hidden"
          animate="show"
          className="text-center mb-8"
        >
          <motion.div
            variants={variants.item}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-glow)] border border-theme-border text-xs font-semibold text-theme-text mb-5 shadow-depth-sm backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-soft)]" aria-hidden />
            MindfulFlow
          </motion.div>
          <motion.h1
            variants={variants.item}
            className="font-display font-extrabold tracking-tight mb-4 md:mb-5 bg-gradient-to-br from-white via-violet-100 to-violet-300/90 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(124,58,237,0.25)] leading-[1.08] text-[clamp(2.125rem,calc(1.25rem+5.5vw),3.75rem)]"
          >
            Péče o náladu v&nbsp;jedné aplikaci
          </motion.h1>
          <motion.p
            variants={variants.item}
            className="text-theme-muted text-sm md:text-fluid-base leading-relaxed max-w-md mx-auto"
          >
            Každý den je jiný. MindfulFlow ti pomáhá zachytit, jak se skutečně cítíš — bez komplikací, bez
            zbytečností. Stačí pár vteřin denně a za týden začneš vidět vzorce, které jsi dřív přehlížel. Poznej sám
            sebe trochu lépe.
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-soft)] mb-5">
                Co v aplikaci najdeš
              </p>
              <ul className="space-y-4">
                {features.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-3 group/item">
                    <span className="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-white/12 to-white/5 flex items-center justify-center border border-white/15 shadow-depth-sm transition-transform duration-300 group-hover/item:scale-110 group-hover/item:border-violet-400/45">
                      <Icon className="w-5 h-5 text-violet-200" aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold text-theme-text text-[0.9375rem]">{title}</p>
                      <p className="text-theme-muted text-[0.8125rem] leading-snug mt-0.5">{text}</p>
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
            whileHover={{ scale: 1.01, boxShadow: "0 0 28px rgba(124, 58, 237, 0.35)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[var(--accent)] hover:opacity-95 text-white font-bold text-base shadow-depth-lg border border-white/15 transition-opacity"
          >
            <Download className="w-5 h-5" aria-hidden />
            Stáhnout aplikaci
          </motion.button>
          <motion.p variants={variants.item} className="text-center text-theme-muted text-xs leading-relaxed">
            Po instalaci spusť MindfulFlow z ikony na ploše nebo v menu aplikací — tam poběží v plném režimu.
          </motion.p>

          {showManualHint && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-violet-200/90 text-xs leading-relaxed rounded-xl bg-violet-500/15 border border-violet-500/25 px-3 py-2"
            >
              V tomto prohlížeči nemusí být instalace k dispozici. Zkus Chrome nebo Edge, případně v menu prohlížeče
              zvol „Instalovat aplikaci“ nebo „Přidat na plochu“.
            </motion.p>
          )}

          <motion.div
            variants={variants.item}
            id="install-fallback"
            className="rounded-2xl border-2 border-white bg-white/[0.04] backdrop-blur-md px-4 py-3 text-sm text-white/60"
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
