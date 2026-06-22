/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import s from "./meetup.module.css";

const EMAIL = "info@musedemaree.com";
const TEL_DISPLAY = "010-5212-9514";
const TEL_HREF = "tel:01052129514";
const PDF_HREF = "/musedemaree-brandbook.pdf";

const MAILTO =
  `mailto:${EMAIL}` +
  `?subject=${encodeURIComponent("미팅 요청 — Muse de Marée")}` +
  `&body=${encodeURIComponent(
    "안녕하세요, 뮤즈드마레 미팅을 요청합니다.\n\n· 성함 / 직함:\n· 회사:\n· 관심 채널 (호텔·금융·면세 등):\n· 희망 일정:\n"
  )}`;

type Channel = {
  num: string;
  label: string;
  title: string;
  sub: string;
  collab: string[];
  value: string;
};

const CHANNELS: Channel[] = [
  {
    num: "01",
    label: "호텔·리조트",
    title: "객실에서 시작되는 브랜드 경험",
    sub: "바다에서 숙성한 한 병이, 머무는 시간을 특별하게 만듭니다.",
    collab: [
      "객실 웰컴 키트·턴다운 어메니티 (미니어처 + 스토리 카드)",
      "미니바 한정 SKU (해당 리조트 전용 넘버링)",
      "F&B 페어링 (시그니처 다이닝·바 코스 연동)",
      "기프트숍 입점 (투숙객 리테일 라인)",
    ],
    value:
      "객실에서 기대하는 건 더 이상 '미니바'가 아니라 '여기서만의 이야기'입니다. 바다에서 숙성한 한 병은 외국인 게스트에게 잊히지 않는 한 줄의 경험이 됩니다. 어메니티 단가가 아니라 객실 기억의 차별화입니다.",
  },
  {
    num: "02",
    label: "금융·모빌리티",
    title: "세상에 단 한 병, 그 사람의 이름으로",
    sub: "VVIP에게 보내는 건 선물이 아니라, 그분만을 위한 한 병이어야 합니다.",
    collab: [
      "넘버링 한정판 (고객 성명·기념일 각인 가능)",
      "코브랜딩 에디션 (브랜드 전용 라벨·패키지)",
      "VIP 기프트 프로그램 (시즌·로열티 등급별 큐레이션)",
      "프라이빗 시음 (라운지·쇼룸 연계 테이스팅)",
    ],
    value:
      "최상위 고객일수록 흔한 명품은 더 이상 신호가 되지 않습니다. 한정 수량으로만 존재하고 시간이 만든 술이라는 서사는 '이 브랜드는 나를 안다'는 메시지를 대신 전합니다. 리텐션을 만드는 건 가격이 아니라 희소성입니다.",
  },
  {
    num: "03",
    label: "백화점·면세",
    title: "여행자가 가져가는, 한국의 시간",
    sub: "한국을 가져가고 싶은 여행자에게, 시간이 깃든 한 병을.",
    collab: [
      "프리미엄 팝업 (시즌·테마 큐레이션 부스)",
      "편집숍·트래블 리테일 입점 (면세 K-프리미엄 라인)",
      "한정 트래블 에디션 (공항·시내면세 전용 패키지)",
      "시음 이벤트 (브랜드 스토리텔링 연계)",
    ],
    value:
      "K-뷰티·K-푸드 다음으로 인바운드가 찾는 건 '들고 갈 수 있는 한국의 격'입니다. 전통 제법을 현대 럭셔리로 재해석한 주류는 면세 MD에 차별화된 한국 프리미엄 서사를 더하고, 여행자에게는 기념품 이상의 소장 가치를 줍니다.",
  },
];

const STATS = [
  {
    num: "110,000+",
    img: "/images/meetup/1.webp",
    cap: "와인과 발효식품 11만여 건을 학습한 예측 모델입니다. 바다가 만드는 숙성의 변화를, 감이 아니라 데이터로 읽습니다.",
  },
  {
    num: "6축",
    img: "/images/meetup/2.png",
    cap: "숙성이 만든 변화를 여섯 갈래(과실·미네랄·효모·산도·바디·여운)로 나눠 측정합니다. 인상이 아니라 국제 기준(WSET·OIV)의 수치로 기록합니다.",
  },
  {
    num: "365일",
    img: "/images/meetup/3.webp",
    cap: "한 병이 남해 수심 30m에서 보낸 시간입니다. 네 계절을 건너온 그 365일의 수온과 해류가 빠짐없이 기록되어, 병과 함께 건네집니다.",
  },
];

export default function MeetupView() {
  const [tab, setTab] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const card = CHANNELS[tab];

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <main className={s.page}>
      {/* ══════ HERO ══════ */}
      <section className={s.hero} ref={heroRef}>
        <div className={s.heroBg}>
          <img src="/images/o3.webp" alt="남해 수심 30m, 해저에 안착한 케이지 — Muse de Marée" />
        </div>
        <div className={s.heroOverlay} aria-hidden="true" />

        <div className={s.heroTop}>
          <img
            className={s.heroLogo}
            src="/images/logo/logo_all_W_KR.png"
            alt="Muse de Marée · 뮤즈드마레"
            width={200}
            height={192}
            fetchPriority="high"
          />
        </div>

        <div className={s.heroBottom}>
          <span className={s.heroRule} aria-hidden="true" />
          <img
            className={s.heroTitle}
            src="/text/mu-hero-title.png"
            alt="숙성은, 바다의 일입니다"
            width={314}
            height={38}
          />
          <p className={s.heroSub}>바다의 시간을 기록하는 브랜드</p>
        </div>
      </section>

      {/* ══════ 01 BRAND HOUSE ══════ */}
      <section className={s.section}>
        <div className={s.inner}>
          <div className={s.sectionHead}>
            <span className={s.label}>01 / Brand House</span>
            <img
              className={s.j1950}
              src="/text/mu-bh-heading.png"
              alt="하나의 바다, 두 개의 기록"
              width={327}
              height={38}
              style={{ marginTop: 22 }}
            />
          </div>

          <div className={s.bhDiagram}>
            <img
              className={s.bhMaster}
              src="/images/logo/logo_all_W_KR.png"
              alt="Muse de Marée · 뮤즈드마레"
              width={170}
              height={163}
            />
            <span className={s.connector} style={{ height: 36 }} aria-hidden="true" />

            <div className={s.bhCardsRow}>
              <div className={s.bhCard}>
                <span className={s.bhCardType}>Champagne</span>
                <span className={s.bhCardDesc}>해저 숙성 · 기록</span>
              </div>
              <div className={s.bhCard}>
                <img
                  className={s.bhCardTypeImg}
                  src="/text/mu-bh-sujung.png"
                  alt="수중양법"
                  width={96}
                  height={31}
                  loading="lazy"
                />
                <span className={s.bhCardDesc}>전통주 · 水中釀法</span>
              </div>
            </div>

            <span className={s.connector} style={{ height: 24, marginTop: 30 }} aria-hidden="true" />
            <p className={s.bhUnifyLabel} style={{ marginTop: 14 }}>
              숙성을 바다에 맡긴다는, 하나의 원칙
            </p>

            <p className={s.bhSuture}>
              샴페인은 바다가 쓴 시간을 기록하고, 전통주는 한국 전통 수중양법(水中釀法)을 잇습니다.
              같은 바다에서, 서로 다른 뿌리로.
            </p>

            <div className={s.bhProducts}>
              <div className={s.bhProduct}>
                <img
                  className={s.bhProductImg}
                  src="/images/04.webp"
                  alt="따개비가 덮인 해저 숙성 샴페인 병"
                  loading="lazy"
                />
                <span className={s.bhProductLabel}>Champagne</span>
              </div>
              <div className={s.bhProduct}>
                <img
                  className={s.bhProductImg}
                  src="/images/meetup/cover.png"
                  alt="따개비가 덮인 전통주 병"
                  loading="lazy"
                />
                <img
                  className={s.bhProductLabelImg}
                  src="/text/mu-bh-label-tradition.png"
                  alt="전통주"
                  width={47}
                  height={20}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ 02 EVIDENCE ══════ */}
      <section className={s.section}>
        <div className={s.inner}>
          <div className={s.sectionHead}>
            <span className={s.label}>02 / Evidence</span>
            <img
              className={`${s.j1950} ${s.evLead}`}
              src="/text/mu-ev-lead.png"
              alt="주장하지 않습니다. 기록으로 증명합니다."
              width={223}
              height={76}
              style={{ marginTop: 22 }}
            />
          </div>

          <div className={s.statList}>
            {STATS.map((st) => (
              <div className={s.statRow} key={st.num}>
                <div className={s.statHead}>
                  <span className={s.statNum}>{st.num}</span>
                  <img className={s.statImg} src={st.img} alt="" loading="lazy" />
                </div>
                <p className={s.statCap}>{st.cap}</p>
              </div>
            ))}
          </div>

          <div className={s.evNote}>
            <span className={s.evNoteTag}>해저 숙성 풍미 예측 시스템(UAPS)</span>
            <p className={s.evNoteDesc}>
              실측 해양 데이터와 물리·화학 법칙으로 보정하고 실제 시음으로 정밀해집니다. 예측마다
              신뢰도까지 함께 공개합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ══════ 03 PARTNERSHIP (탭) ══════ */}
      <section className={s.channels}>
        <div className={s.inner}>
          <div className={s.sectionHead}>
            <span className={s.label}>03 / Partnership</span>
            <img
              className={s.j1950}
              src="/text/mu-pt-heading.png"
              alt="고객은 무엇을 얻는가"
              width={273}
              height={38}
              style={{ marginTop: 22 }}
            />
            <p className={s.channelsLead}>제품이 아니라, 고객이 가져갈 경험을 제안합니다.</p>
          </div>

          <div className={s.tabBar} role="tablist" aria-label="파트너 채널">
            {CHANNELS.map((c, i) => (
              <button
                key={c.num}
                type="button"
                role="tab"
                aria-selected={tab === i}
                className={`${s.tab} ${tab === i ? s.tabActive : ""}`}
                onClick={() => setTab(i)}
              >
                <span className={s.tabNum}>{c.num}</span>
                <span className={s.tabLabel}>{c.label}</span>
              </button>
            ))}
          </div>

          <div className={s.panel} role="tabpanel">
            <h3 className={s.panelHeadline}>
              {card.title.split(", ").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 ? "," : ""}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h3>
            <p className={s.panelSub}>{card.sub}</p>

            <div className={s.collabBlock}>
              <span className={s.collabLabel}>협업 형태</span>
              {card.collab.map((item) => (
                <div className={s.collabItem} key={item}>
                  <span className={s.collabBullet} aria-hidden="true">
                    •
                  </span>
                  <span className={s.collabText}>{item}</span>
                </div>
              ))}
            </div>

            <div className={s.valueBlock}>
              <span className={s.valueLabel}>파트너 가치</span>
              <p className={s.valueText}>{card.value}</p>
            </div>
          </div>

          <p className={s.channelNote}>
            단가·물량·리드타임 등 실무 조건은 미팅에서 안내드립니다.
          </p>
        </div>
      </section>

      {/* ══════ 04 CONTACT ══════ */}
      <section className={s.section}>
        <div className={s.inner}>
          <span className={s.label}>04 / Contact</span>
          <p className={s.contactLead}>부스에서 나눈 이야기를, 이어가겠습니다.</p>

          <div className={s.contactRows}>
            <div className={s.cRow}>
              <span className={s.cRowLabel}>담당</span>
              <span className={s.cRowValue}>백호암 이사</span>
            </div>
            <div className={s.cRow}>
              <span className={s.cRowLabel}>EMAIL</span>
              <a className={s.cRowValueMono} href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </div>
            <div className={s.cRow}>
              <span className={s.cRowLabel}>TEL</span>
              <a className={s.cRowValueMono} href={TEL_HREF}>
                {TEL_DISPLAY}
              </a>
            </div>
            <div className={s.cRow}>
              <span className={s.cRowLabel}>홈페이지</span>
              <a className={`${s.cRowValueMono} ${s.cRowHome}`} href="/">
                musedemaree.com
                <span className={s.cRowHomeArrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>

          <div className={s.ctaBlock}>
            <a className={s.ctaPrimary} href={MAILTO}>
              이메일로 미팅 잡기
            </a>
            <a className={s.ctaSecondary} href={PDF_HREF} download>
              브랜드 소개서 PDF
              <span className={s.ctaArrow} aria-hidden="true">
                ↓
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <img
            className={s.footerLogo}
            src="/images/logo/logo_text_trans_W.png"
            alt="Muse de Marée"
            width={188}
            height={29}
            loading="lazy"
          />
          <p className={s.footerTagline}>바다의 시간을 기록하는 브랜드</p>
          <div className={s.footerMeta}>
            <span className={s.footerCopy}>© 2026 MUSE DE MARÉE</span>
            <span className={s.footerStamp}>남해 30M · 첫 인양 2026</span>
          </div>
        </div>
      </footer>

      {/* ══════ STICKY CTA ══════ */}
      <div className={`${s.sticky} ${showSticky ? s.stickyShow : ""}`}>
        <a className={s.stickyPhone} href={TEL_HREF}>
          {TEL_DISPLAY}
        </a>
        <a className={s.stickyMeeting} href={MAILTO}>
          이메일로 미팅 잡기
        </a>
      </div>
    </main>
  );
}
