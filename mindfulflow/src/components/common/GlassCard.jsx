/**
 * Shared glass card container used across Statistics, Journal, etc.
 * Provides the standard dark glassmorphism surface with a subtle gradient overlay.
 */
export default function GlassCard({ children, className = '' }) {
  return (
    <div
      className={`glass-card rounded-[2rem] border border-white/10 ring-1 ring-white/5 backdrop-blur-xl bg-[#0f172a]/40 shadow-glass-lg relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-[2rem]" />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
