import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const PageTransition = forwardRef<HTMLDivElement, { children: ReactNode }>(
  ({ children }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
);

PageTransition.displayName = "PageTransition";

export default PageTransition;
