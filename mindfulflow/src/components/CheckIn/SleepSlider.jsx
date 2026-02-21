import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Moon } from 'lucide-react';

// Sleep slider for selecting sleep hours
const SleepSlider = memo(function SleepSlider({ value, onChange }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Motion value target (0-100)
  const x = useMotionValue(0);
  // Smooth spring physics for transitions between snaps - "jumps"
  const smoothX = useSpring(x, { stiffness: 500, damping: 30 });

  const width = useTransform(smoothX, (v) => `${v}%`);
  const left = useTransform(smoothX, (v) => `${v}%`);

  // Sync external value changes
  useEffect(() => {
    const percentage = Math.min(100, Math.max(0, (value / 12) * 100));
    x.set(percentage);
  }, [value, x]);

  const handlePointerAction = useCallback(
    (e) => {
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;

      // Calculate raw percentage
      let rawPercentage = (relativeX / rect.width) * 100;
      rawPercentage = Math.max(0, Math.min(100, rawPercentage));

      // Calculate stepped value immediately
      const rawValue = (rawPercentage / 100) * 12;
      const newValue = Math.round(rawValue * 2) / 2;

      // Calculate snapped percentage based on the stepped value
      const snappedPercentage = (newValue / 12) * 100;

      // Update motion target to snapped value - this causes the "jump"
      x.set(snappedPercentage);

      // Update data state
      if (newValue !== value) {
        onChange(newValue);
      }
    },
    [onChange, value, x],
  );

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointerAction(e);
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      handlePointerAction(e);
    }
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    // Ensure perfect snap on release (redundant but safe)
    const percentage = Math.min(100, Math.max(0, (value / 12) * 100));
    x.set(percentage);
  };

  return (
    <div className="mb-10 w-full select-none">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl text-blue-300">
            <Moon className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Spánek</h3>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-blue-300 tabular-nums">{value}</span>
          <span className="text-sm font-medium text-blue-300/50">hodin</span>
        </div>
      </div>

      {/* Main Interactive Container */}
      <div
        className="relative h-16 cursor-pointer group touch-none mx-2"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Track Container (visual only) */}
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-14 bg-black/20 rounded-2xl pointer-events-none transition-colors group-hover:bg-black/30" />

        {/* Internal Track Area */}
        <div ref={trackRef} className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-full pointer-events-none">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/10 rounded-full -translate-y-1/2 overflow-hidden">
            {/* Filled Gradient */}
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-400"
              style={{ width }} // Direct spring value binding
            />
          </div>

          {/* Ticks */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-0.5">
            {[0, 2, 4, 6, 8, 10, 12].map((tick) => (
              <div key={tick} className="flex flex-col items-center gap-2.5">
                <div
                  className={`w-0.5 h-8 -mt-0.5 rounded-full transition-colors duration-300 ${
                    tick <= value ? 'bg-blue-400/50' : 'bg-white/5'
                  }`}
                />
                <span
                  className={`absolute top-10 text-xs font-bold transition-colors duration-300 ${
                    tick <= value ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {tick}
                </span>
              </div>
            ))}
          </div>

          {/* Thumb */}
          <motion.div
            className="absolute top-1/2 -ml-3 w-6 h-6 bg-white rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10"
            style={{ left, y: '-50%' }} // Direct spring value binding
          >
            {/* Pulse effect while dragging */}
            <div className={`absolute inset-0 bg-blue-500 rounded-full animate-ping ${isDragging ? 'opacity-30' : 'opacity-0'}`} />
            <div className="absolute inset-0 rounded-full ring-2 ring-white/5 group-hover:ring-white/10" />
          </motion.div>
        </div>
      </div>
    </div>
  );
});

export default SleepSlider;

