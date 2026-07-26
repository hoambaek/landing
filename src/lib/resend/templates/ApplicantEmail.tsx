import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Img,
} from "@react-email/components";

export type FormKind = "invite" | "partner" | "brandbook" | "bottle" | "newsletter";

/**
 * 브랜드 소개서는 2단계 발송:
 * - "ack": 신청 접수 확인 (PDF 없음) — 공개 폼 제출 시
 * - "send": 소개서 전달 (PDF 첨부) — 관리자 승인 시
 * invite·partner는 항상 "send".
 */
export type EmailMode = "ack" | "send";

interface ApplicantEmailProps {
  kind: FormKind;
  name?: string;
  mode?: EmailMode;
}

/** 발송 메일의 이미지(로고)용 절대 URL */
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://musedemaree.com";

/**
 * 신청자 확인 메일 — Paper v2 시안(프레임 + 카드 + 법적 푸터).
 * 외곽 연회색 프레임 안에 #C4BFBB 카드, 브랜드 로고 헤더, 본문, 다크 법적 푸터.
 */
export function ApplicantEmail({ kind, name, mode = "send" }: ApplicantEmailProps) {
  const t =
    kind === "brandbook" && mode === "ack" ? BRANDBOOK_ACK_COPY : COPY[kind];
  const greeting = name ? `${name} 님, 안녕하세요.` : "안녕하세요.";

  return (
    <Html lang="ko">
      <Head>
        {/* 모바일: 인라인 스타일보다 우선하도록 !important 필수 (지원 안 하는 클라이언트는 상향된 기본값으로 동작) */}
        <style>{`
          @media only screen and (max-width: 480px) {
            .email-card { margin: 0 auto !important; }
            .email-header { padding: 40px 0 34px !important; }
            .email-content { padding: 40px 24px 44px !important; }
            .email-title { font-size: 28px !important; line-height: 36px !important; }
            .email-footer { padding: 36px 24px 40px !important; }
          }
        `}</style>
      </Head>
      <Body style={styles.body}>
        <Container className="email-card" style={styles.card}>
          {/* ── 헤더 (로고 + 모토) ── */}
          <Section className="email-header" style={styles.header}>
            <Img
              src={`${BASE_URL}/images/logo/logo_trans_W.png`}
              width="132"
              height="110"
              alt=""
              style={styles.symbol}
            />
            <Img
              src={`${BASE_URL}/images/logo/logo_text_trans_W.png`}
              width="95"
              height="14"
              alt="MUSE DE MARÉE"
              style={styles.wordmark}
            />
          </Section>

          {/* ── 본문 ── */}
          <Section className="email-content" style={styles.content}>
            <Text style={styles.eyebrow}>{t.eyebrow}</Text>
            <Text className="email-title" style={styles.title}>
              {t.title}
            </Text>
            <Text style={styles.hello}>{greeting}</Text>
            {t.body.map((line, i) => (
              <Text key={i} style={styles.para}>
                {line}
              </Text>
            ))}
            <Hr style={styles.rule} />
            <Img
              src={`${BASE_URL}/images/logo/logo_text_trans.png`}
              width="150"
              height="23"
              alt="Muse de Marée"
              style={styles.sign}
            />
          </Section>

          {/* ── 법적 푸터 (다크) ── */}
          <Section className="email-footer" style={styles.footer}>
            <Img
              src={`${BASE_URL}/images/logo/logo_text_trans_W.png`}
              width="112"
              height="16"
              alt="MUSE DE MARÉE"
              style={styles.fName}
            />
            <Text style={styles.fInfo}>
              주식회사 오크니 · 대표 정설화 · 사업자등록번호 859-85-03139
            </Text>
            <Text style={styles.fInfo}>서울특별시 강남구 압구정로 306, B1 #6-J14</Text>
            <Text style={styles.fInfo}>고객 문의 info@musedemaree.com</Text>
            <Hr style={styles.fRule} />
            <Text style={styles.fCopy}>
              © 2026 MUSE DE MARÉE. ALL RIGHTS RESERVED.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function getApplicantSubject(kind: FormKind, mode: EmailMode = "send"): string {
  if (kind === "brandbook" && mode === "ack") return BRANDBOOK_ACK_SUBJECT;
  return SUBJECT[kind];
}

const SUBJECT: Record<FormKind, string> = {
  invite: "초대 신청이 접수되었습니다 | Muse de Marée",
  partner: "파트너십 문의가 접수되었습니다 | Muse de Marée",
  brandbook: "바다의 시간을 한 권에 담았습니다 | Muse de Marée",
  bottle: "바다의 시간이 당신의 이름으로 남았습니다 | Muse de Marée",
  newsletter: "뉴스레터 구독이 시작되었습니다 | Muse de Marée",
};

/** 브랜드 소개서 접수 확인(ack) 전용 제목·본문 */
const BRANDBOOK_ACK_SUBJECT =
  "브랜드 소개서 요청이 접수되었습니다 | Muse de Marée";

const BRANDBOOK_ACK_COPY = {
  eyebrow: "BRAND",
  title: "요청이 접수되었습니다",
  body: [
    "Muse de Marée 브랜드 소개서를 요청해 주셔서 감사합니다. 요청은 정상적으로 접수되었습니다.",
    "보내주신 정보를 확인한 뒤, 준비되는 대로 소개서를 이 메일로 보내드리겠습니다.",
    "잠시만 기다려 주세요. 곧 다시 인사드리겠습니다.",
  ],
};

const COPY: Record<
  FormKind,
  { eyebrow: string; title: string; body: string[] }
> = {
  invite: {
    eyebrow: "OCEAN CELLAR PRIVÉ",
    title: "초대 신청이 접수되었습니다",
    body: [
      "Ocean Cellar Privé 초대를 신청해 주셔서 감사합니다. 신청은 정상적으로 접수되었습니다.",
      "멤버십은 인양되는 수량에 맞춰 소수의 자리만 열립니다. 다음 모집이 시작되면, 가장 먼저 초대장을 보내 드리겠습니다.",
      "곧 좋은 소식으로 다시 인사드리겠습니다.",
    ],
  },
  partner: {
    eyebrow: "PARTNERSHIP",
    title: "파트너십 문의가 접수되었습니다",
    body: [
      "Muse de Marée 파트너십에 관심 가져 주셔서 감사합니다. 문의는 정상적으로 접수되었습니다.",
      "보내 주신 내용을 검토한 뒤, 영업일 기준 2일 이내에 담당자가 제안서와 함께 회신드리겠습니다.",
      "좋은 인연으로 이어지기를 기대하겠습니다.",
    ],
  },
  brandbook: {
    eyebrow: "BRAND",
    title: "브랜드 소개서를 보내드립니다",
    body: [
      "Muse de Marée 브랜드 소개서를 요청해 주셔서 감사합니다. 요청하신 소개서를 이 메일에 함께 보내드립니다.",
      "한국 심해에서 숙성하는 샴페인의 철학과 기록 방식, 퀴베 라인업과 파트너십 안내를 한 권에 담았습니다.",
      "함께할 자리에 대해 더 이야기 나누고 싶으시면, 언제든 이 메일로 회신해 주세요.",
    ],
  },
  bottle: {
    eyebrow: "OCEAN CELLAR™",
    /* 제목은 물건을 세지 않는다 — "병 하나"는 재고를 세는 어감이라
       한정된 개체가 아니라 여러 개 중 하나로 읽힌다.
       브랜드북 메일("바다의 시간을 한 권에 담았습니다")과 같은 어법으로 맞췄다. */
    title: "바다의 시간이 당신의 이름으로 남았습니다",
    /* 브랜드 보이스 정본(brand-guide.md 08) — "심연을 닮은 고요함".
       짧은 문장, 관찰 일기체, 과잉 수사 금지. 3단 명제의 1차 명제를 그대로 싣는다.
       "한 해"는 쓰지 않는다 — 숙성 기간은 퀴베마다 6개월에서 2년까지 다르다.
       수심은 정본 표기 "남해 수심 30m". */
    body: [
      "샴페인 한 병이 당신의 이름 아래 놓였습니다.",
      "프랑스 샹파뉴에서 양조하고, 한국 남해에서 숙성합니다. 이 병이 수심 30m에서 보낸 시간은 태그로 언제든 다시 열어볼 수 있습니다.",
      "다음 인양과 새 기록의 소식을 이 메일로 가장 먼저 전해 드리겠습니다.",
    ],
  },
  newsletter: {
    eyebrow: "JOURNAL",
    title: "뉴스레터를 구독해 주셔서 감사합니다",
    body: [
      "Muse de Marée의 소식을 구독해 주셔서 감사합니다.",
      "다음 인양과 새로운 기록, 바다의 시간에 관한 이야기를 계절에 맞춰 가끔 전해 드리겠습니다.",
      "받은 편지함에서 곧 다시 인사드리겠습니다.",
    ],
  },
};

/* ── 스타일 (Paper v2 토큰, 이메일 인라인) ── */
const serif = '"Cormorant Garamond", Georgia, "Times New Roman", serif';
const sans = '"Noto Sans KR", -apple-system, "Apple SD Gothic Neo", sans-serif';
const mono = '"IBM Plex Mono", "Courier New", monospace';

const styles = {
  body: {
    margin: "0",
    padding: "0",
    backgroundColor: "#DDD8D2",
    fontFamily: sans,
  },
  card: {
    // 고정 width 금지: max-width 미지원 클라이언트가 600px 폭을 유지한 채
    // 전체를 축소 렌더링해 글자가 작아지는 원인이 됨 (fluid 방식)
    width: "100%",
    maxWidth: "600px",
    // 바깥 상하 여백은 body padding이 아닌 여기에 둔다 — react-email이
    // body padding을 내부 td로 옮겨서 미디어쿼리 body 셀렉터가 안 닿음
    margin: "40px auto",
    backgroundColor: "#C4BFBB",
  },
  header: {
    padding: "52px 0 44px",
    textAlign: "center" as const,
    borderBottom: "1px solid rgba(49,46,42,0.12)",
  },
  // 로고에 opacity·그림자 등 효과 금지 — 배경(#C4BFBB)이 로고보다 어두워서
  // 투과시키면 배경이 흰 획 안으로 비쳐 그림자처럼 보인다. 순백 그대로 둘 것.
  symbol: {
    display: "block",
    margin: "0 auto",
  },
  wordmark: {
    display: "block",
    margin: "18px auto 0",
  },
  content: {
    padding: "48px 56px 52px",
  },
  eyebrow: {
    margin: "0 0 18px",
    fontFamily: mono,
    fontSize: "12px",
    letterSpacing: "0.22em",
    color: "#8C6B33",
  },
  title: {
    margin: "0 0 26px",
    fontFamily: serif,
    fontSize: "34px",
    fontWeight: 300,
    lineHeight: "40px",
    letterSpacing: "-0.01em",
    color: "#312E2A",
    wordBreak: "keep-all" as const,
  },
  hello: {
    margin: "0 0 18px",
    fontFamily: sans,
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "26px",
    color: "#312E2A",
  },
  para: {
    margin: "0 0 14px",
    fontFamily: sans,
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "28px",
    color: "#4A453F",
    wordBreak: "keep-all" as const,
  },
  rule: {
    width: "36px",
    margin: "30px 0 22px",
    border: "none",
    borderTop: "1px solid #8C6B33",
  },
  sign: {
    display: "block",
    margin: "0",
  },
  footer: {
    padding: "40px 48px 44px",
    backgroundColor: "#14110F",
    textAlign: "center" as const,
  },
  fName: {
    display: "block",
    margin: "0 auto 12px",
  },
  fInfo: {
    margin: "0 0 5px",
    fontFamily: sans,
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "19px",
    color: "rgba(242,239,233,0.55)",
  },
  fRule: {
    width: "300px",
    margin: "18px auto",
    border: "none",
    borderTop: "1px solid rgba(242,239,233,0.12)",
  },
  fCopy: {
    margin: "0",
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "0.1em",
    color: "rgba(242,239,233,0.4)",
  },
};
