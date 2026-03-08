"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Reveal({
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
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealImage({
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
      initial={{ opacity: 0, scale: 1.02 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1.4, delay, ease: [0.23, 1.0, 0.32, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ObservationSection() {
  return (
    <section id="observation" className="s-obs" aria-label="Observation">
      <div className="s-obs__proposition">
        <div className="container">
          <Reveal>
            <p className="s-obs__label">observation.</p>
          </Reveal>
          <Reveal delay={0.12}>
            <h2 className="s-obs__headline">
              바다는
              <br />
              가장 오래된
              <br />
              저장고입니다.
            </h2>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="s-obs__intro">
              <p>
                수천 년간 바다는 온도와 빛으로부터
                <br />
                모든 것을 고요히 품어왔습니다.
              </p>
              <p>
                샹파뉴의 백악 토양이 만든 샴페인을
                <br />
                한국 남해 청정해역의 바다가 숙성합니다.
              </p>
              <p>
                두 개의 떼루아가
                <br />
                하나의 샴페인 안에서 만납니다.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <RevealImage delay={0.36} className="s-obs__image">
        <img
          src="/images/o1.webp"
          alt="해저 숙성 환경"
          className="s-obs__image-inner"
        />
      </RevealImage>
    </section>
  );
}
