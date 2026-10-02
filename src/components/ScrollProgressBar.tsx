import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight + 20;
      setIsVisible(isScrollable);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none bg-black/5 dark:bg-white/5"
      role="progressbar"
      aria-label="Page scroll progress"
    >
      <motion.div
        className="h-full bg-[#0047AB] dark:bg-[#3B82F6] origin-left shadow-[0_0_8px_rgba(0,71,171,0.5)] dark:shadow-[0_0_8px_rgba(59,130,246,0.6)]"
        style={{ scaleX }}
      />
    </div>
  );
}
