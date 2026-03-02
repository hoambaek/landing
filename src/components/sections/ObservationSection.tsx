"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/** Blur-in animation */
function BlurIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ filter: "blur(20px)", opacity: 0 }}
      animate={isInView ? { filter: "blur(0px)", opacity: 1 } : {}}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Body text — line-by-line stagger fade-up */
const bodyLines = [
  "수천 년간 바다는 온도와 빛으로부터 모든 것을 고요히 품어왔습니다.",
  "뮤즈드마레는 그 깊은 심해에 샴페인을 맡깁니다.",
  "",
  "압력, 어둠, 그리고 파동.",
  "자연이 직접 병을 어루만지며 완성하는 시간입니다.",
  "샹파뉴의 토양이 빚은 첫 번째 떼루아,",
  "한국 바다의 심연이 더하는 두 번째 떼루아.",
  "",
  { text: "손길을 멈춘 곳에서, 시간이 시작됩니다.", className: "s-obs__body-line s-obs__body-line--closing" },
];

const lineContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.5 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

function BodyLines() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      className="s-obs__body"
      variants={lineContainerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {bodyLines.map((line, i) => {
        if (line === "") return <div key={i} className="s-obs__body-gap" />;
        if (typeof line === "object") {
          return (
            <motion.p key={i} variants={lineVariants} className={line.className}>
              {line.text}
            </motion.p>
          );
        }
        return (
          <motion.p key={i} variants={lineVariants} className="s-obs__body-line">
            {line}
          </motion.p>
        );
      })}
    </motion.div>
  );
}

export default function ObservationSection() {
  return (
    <section id="observation" className="s-obs">
      {/* Left illustration */}
      <div className="s-obs__illust">
        <BlurIn delay={0.3}>
          <img src="/images/obs-1.png" alt="" className="s-obs__illust-img" />
        </BlurIn>
      </div>

      {/* Center content */}
      <div className="s-obs__content">
        <BlurIn delay={0.15}>
          <h2 className="s-obs__title">
            바다는
            <br />
            가장 오래된
            <br />
            저장고입니다.
          </h2>
        </BlurIn>

        <BodyLines />

      </div>

      {/* Page number */}
      <span className="s-obs__page-num">셀러 1</span>
    </section>
  );
}
