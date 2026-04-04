/**
 * Karta — měkký okraj, bez ostrých stínů (design systém MindfulFlow).
 */
export default function GlassCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-theme-border bg-theme-card transition-[background-color,border-color] duration-theme ease-out ${className}`}
    >
      {children}
    </div>
  );
}
