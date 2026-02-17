import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * Empty state component for when no mood data exists
 */
export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center px-4"
    >
      {/* Icon */}
      <div className="mb-6 relative">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center"
        >
          <Sparkles className="w-12 h-12 text-violet-400" />
        </motion.div>
      </div>

      {/* Message */}
      <h3 className="text-2xl font-semibold mb-3 text-white/90">
        Zatím tu není žádný záznam
      </h3>
      <p className="text-white/70 max-w-md">
        Začni tím, že zaznamenáš svou první náladu.
      </p>
    </motion.div>
  );
}
