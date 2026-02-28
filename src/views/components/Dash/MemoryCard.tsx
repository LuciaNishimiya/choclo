/** @jsxImportSource react */
import React from "react";

interface MemoryCardProps {
  title: string;
  percentage: string | number;
  used: string;
  total: string;
  colorClasses: string;
  gradientClasses: string;
  borderColorHover: string;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ 
  title, percentage, used, total, colorClasses, gradientClasses, borderColorHover 
}) => {
  return (
    <div className={`bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-4 ${borderColorHover} transition-colors`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-zinc-300">{title}</span>
        <span className={`text-lg font-bold ${colorClasses} font-mono`}>{percentage || "0"}%</span>
      </div>
      <div className="text-[10px] text-zinc-500 mb-3">{used || "0"} / {total || "0"}</div>
      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
        <div 
          className={`h-full ${gradientClasses} transition-all duration-500`} 
          style={{ width: `${percentage || 0}%` }}
        ></div>
      </div>
    </div>
  );
};
