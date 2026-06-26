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

export type FormKind = "invite" | "partner" | "brandbook";

interface ApplicantEmailProps {
  kind: FormKind;
  name?: string;
}

/** 발송 메일의 이미지(로고)용 절대 URL */
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://musedemaree.com";

/**
 * 신청자 확인 메일 — Paper v2 시안(프레임 + 카드 + 법적 푸터).
 * 외곽 연회색 프레임 안에 #C4BFBB 카드, 브랜드 로고 헤더, 본문, 다크 법적 푸터.
 */
export function ApplicantEmail({ kind, name }: ApplicantEmailProps) {
  const t = COPY[kind];
  const greeting = name ? `${name} 님, 안녕하세요.` : "안녕하세요.";

  return (
    <Html lang="ko">
      <Head />
      <Body style={styles.body}>
        <Container style={styles.card}>
          {/* ── 헤더 (로고 + 모토) ── */}
          <Section style={styles.header}>
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
          <Section style={styles.content}>
            <Text style={styles.eyebrow}>{t.eyebrow}</Text>
            <Text style={styles.title}>{t.title}</Text>
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
          <Section style={styles.footer}>
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

export function getApplicantSubject(kind: FormKind): string {
  return SUBJECT[kind];
}

const SUBJECT: Record<FormKind, string> = {
  invite: "초대 신청이 접수되었습니다 | Muse de Marée",
  partner: "파트너십 문의가 접수되었습니다 | Muse de Marée",
  brandbook: "바다의 시간을 한 권에 담았습니다 | Muse de Marée",
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
      "한국 심해에서 숙성하는 샴페인의 철학과 기록 방식, 큐베 라인업과 파트너십 안내를 한 권에 담았습니다.",
      "함께할 자리에 대해 더 이야기 나누고 싶으시면, 언제든 이 메일로 회신해 주세요.",
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
    padding: "40px 0",
    backgroundColor: "#DDD8D2",
    fontFamily: sans,
  },
  card: {
    width: "600px",
    maxWidth: "100%",
    margin: "0 auto",
    backgroundColor: "#C4BFBB",
  },
  header: {
    padding: "52px 0 44px",
    textAlign: "center" as const,
    borderBottom: "1px solid rgba(49,46,42,0.12)",
  },
  symbol: {
    display: "block",
    margin: "0 auto",
    opacity: 0.95,
  },
  wordmark: {
    display: "block",
    margin: "18px auto 0",
    opacity: 0.92,
  },
  content: {
    padding: "48px 56px 52px",
  },
  eyebrow: {
    margin: "0 0 18px",
    fontFamily: mono,
    fontSize: "11px",
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
  },
  hello: {
    margin: "0 0 18px",
    fontFamily: sans,
    fontSize: "15px",
    fontWeight: 400,
    lineHeight: "25px",
    color: "#312E2A",
  },
  para: {
    margin: "0 0 14px",
    fontFamily: sans,
    fontSize: "14px",
    fontWeight: 300,
    lineHeight: "26px",
    color: "#4A453F",
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
    opacity: 0.92,
  },
  fInfo: {
    margin: "0 0 5px",
    fontFamily: sans,
    fontSize: "11px",
    fontWeight: 300,
    lineHeight: "17px",
    color: "rgba(242,239,233,0.42)",
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
    fontSize: "10px",
    letterSpacing: "0.1em",
    color: "rgba(242,239,233,0.3)",
  },
};
