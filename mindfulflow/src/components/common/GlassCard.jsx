/**
 * Jednoduchá karta — tmavé pozadí, okraj (žádné sklo).
 */
export default function GlassCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-zinc-600/80 bg-zinc-900/90 ${className}`}
    >
      {children}
    </div>
  );
}
