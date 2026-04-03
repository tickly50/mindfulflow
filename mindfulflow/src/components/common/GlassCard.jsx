import { motion } from 'framer-motion';
import { microInteractions } from '../../utils/animations';

/**
 * Glass surface with depth, glow on hover, and spring micro-interaction.
 */
export default function GlassCard({ children, className = '' }) {
  return (
    <motion.div
      whileHover={microInteractions.card.hover}
      whileTap={microInteractions.card.tap}
      className={`group glass-card rounded-[22px] border border-white/15 ring-1 ring-violet-500/[0.12] backdrop-blur-2xl bg-[#020617]/50 shadow-studio relative overflow-hidden transition-[box-shadow,border-color,transform] duration-500 hover:shadow-glow-violet hover:border-white/25 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.07] via-transparent to-fuchsia-600/[0.05] pointer-events-none rounded-[22px] opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
