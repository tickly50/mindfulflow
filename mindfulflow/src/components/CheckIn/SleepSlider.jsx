import { memo, useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Moon from 'lucide-react/dist/esm/icons/moon';

const SleepSlider = memo(function SleepSlider({ value, onChange }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  // Motion value target (0-100) maps directly to 0-12 hours
  const x = useMotionValue((value / 12) * 100);

  const width = useTransform(x, (v) => `${v}%`);
  const left = useTransform(x, (v) => `${v}%`);

  // Sync external value changes ONLY when not dragging
  useEffect(() => {
    if (!isDragging) {
      setDisplayValue(value);
      if (inputRef.current) inputRef.current.value = value;
      animate(x, (value / 12) * 100, { type: 'spring', stiffness: 400, damping: 30 });
    }
  }, [value, isDragging, x]);

  const handleInput = (e) => {
    const rawVal = parseFloat(e.target.value);
    
    // Smoothly update visual track directly via framer-motion (0 overhead)
    x.set((rawVal / 12) * 100);

    // Only update React component text when snapping to nearest 0.5
    const snapped = Math.round(rawVal * 2) / 2;
    setDisplayValue(prev => prev !== snapped ? snapped : prev);
  };

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    if (!inputRef.current) return;

    // Physical snap after release
    const rawVal = parseFloat(inputRef.current.value);
    const snapped = Math.round(rawVal * 2) / 2;

    inputRef.current.value = snapped;
    setDisplayValue(snapped);
    
    // Visual spring snap animation
    animate(x, (snapped / 12) * 100, { type: 'spring', stiffness: 500, damping: 30 });
    
    // Safely update parent context
    if (snapped !== value) {
      onChange(snapped);
    }
  };

  return (
    <div className="mb-10 w-full select-none">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500/30 to-blue-500/10 rounded-xl text-blue-300 shadow-glow-violet ring-1 ring-white/10">
            <Moon className="w-6 h-6 drop-shadow-md" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-200 to-indigo-300 bg-clip-text text-transparent">Spánek</h3>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-blue-300 tabular-nums">{displayValue}</span>
          <span className="text-sm font-medium text-blue-300/50">hodin</span>
        </div>
      </div>

      {/* Main Interactive Container */}
      <div className="relative h-16 group mx-2">
        {/* NATIVE RANGE OVERLAY FOR FLAWLESS SECURE HARDWARE ACCELERATED DRAGGING */}
        <input
          ref={inputRef}
          type="range"
          min="0"
          max="12"
          step="0.01"
          defaultValue={value}
          onInput={handleInput}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute inset-x-6 inset-y-0 h-full opacity-0 cursor-pointer z-50 m-0 w-[calc(100%-3rem)] touch-none"
          style={{ WebkitAppearance: 'none' }}
        />

        {/* Track Container (visual only) */}
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-16 bg-white/5 rounded-[2rem] border border-white/10 pointer-events-none transition-colors group-hover:bg-white/10 shadow-inner" />

        {/* Internal Track Area */}
        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-full pointer-events-none">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-black/40 rounded-full -translate-y-1/2 overflow-hidden shadow-inner">
            {/* Filled Gradient */}
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 will-change-transform"
              style={{ width }}
            />
          </div>

          {/* Ticks */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-0.5 pointer-events-none">
            {[0, 2, 4, 6, 8, 10, 12].map((tick) => (
              <div key={tick} className="flex flex-col items-center gap-2.5">
                <div
                  className={`w-0.5 h-8 -mt-0.5 rounded-full transition-colors duration-300 ${
                    tick <= displayValue ? 'bg-blue-400/50' : 'bg-white/5'
                  }`}
                />
                <span
                  className={`absolute top-10 text-xs font-bold transition-colors duration-300 ${
                    tick <= displayValue ? 'text-white' : 'text-white/60'
                  }`}
                >
                  {tick}
                </span>
              </div>
            ))}
          </div>

          {/* Thumb */}
          <motion.div
            className="absolute top-1/2 -ml-3 w-6 h-6 bg-white rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10 pointer-events-none will-change-transform"
            style={{ left, y: '-50%' }}
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

