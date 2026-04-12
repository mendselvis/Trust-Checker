import { motion } from "framer-motion";
import { type RedFlag } from "@workspace/api-client-react/src/generated/api.schemas";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RedFlagTimelineProps {
  flags: RedFlag[];
}

export function RedFlagTimeline({ flags }: RedFlagTimelineProps) {
  if (!flags || flags.length === 0) return null;

  return (
    <div className="w-full mt-4 mb-2">
      <div className="flex justify-between text-xs font-medium text-muted-foreground mb-3 px-1">
        <span>Start of chat</span>
        <span>End of chat</span>
      </div>
      
      <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
        <TooltipProvider delayDuration={200}>
          {flags.map((flag, i) => {
            const colorClass = 
              flag.severity === "high" ? "bg-rose-500" :
              flag.severity === "medium" ? "bg-amber-500" : "bg-blue-400";
              
            return (
              <Tooltip key={flag.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.5 + (i * 0.1),
                      type: "spring", 
                      stiffness: 300 
                    }}
                    className={`absolute top-0 h-full w-2.5 rounded-full ${colorClass} cursor-pointer hover:ring-2 hover:ring-white/50 hover:scale-125 transition-transform z-10`}
                    style={{ left: `calc(${Math.min(Math.max(flag.position * 100, 0), 98)}%)`, transform: "translateX(-50%)" }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[250px] p-3 text-sm border-slate-700 bg-slate-800">
                  <div className="font-semibold text-white mb-1">{flag.label}</div>
                  <div className="text-slate-300">{flag.description}</div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
