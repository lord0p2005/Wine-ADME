import React, { useState } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TopicTooltipProps {
  title: string;
  explanation: string;
  id?: string;
  align?: "left" | "right" | "center";
}

export const TopicTooltip: React.FC<TopicTooltipProps> = ({ 
  title, 
  explanation, 
  id,
  align = "left" 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Determine left/right alignment styling
  let alignClasses = "left-0 origin-bottom-left";
  if (align === "right") {
    alignClasses = "right-0 origin-bottom-right";
  } else if (align === "center") {
    alignClasses = "left-1/2 -translate-x-1/2 origin-bottom";
  }

  return (
    <span 
      id={id}
      className="inline-flex items-center gap-1.5 group relative cursor-help select-none"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <span className="border-b border-dashed border-[#141414] group-hover:text-slate-700 transition-colors font-bold uppercase tracking-wider">
        {title}
      </span>
      <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#141414] transition-colors shrink-0" />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute bottom-full mb-2.5 z-50 w-64 bg-[#141414] text-white text-[11px] leading-relaxed p-3 border border-[#141414] shadow-xl ${alignClasses}`}
          >
            {/* Tiny arrow pointing down */}
            <div className={`absolute top-full w-2 h-2 bg-[#141414] rotate-45 transform -translate-y-1 ${
              align === "right" ? "right-4" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-4"
            }`}></div>
            <p className="font-sans normal-case text-slate-200">
              {explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};
