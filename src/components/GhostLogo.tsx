import { Ghost } from "lucide-react";
import { motion } from "framer-motion";

export const GhostLogo = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
      <div className="relative flex items-center gap-2">
        <div className="relative">
          <Ghost className="w-8 h-8 text-primary" />
          <div className="absolute inset-0 bg-primary/30 blur-md" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          Ghost<span className="text-primary">Buster</span>
        </span>
      </div>
    </motion.div>
  );
};
