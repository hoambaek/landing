import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";

export type FormKind = "invite" | "partner" | "brandbook";

interface ApplicantEmailProps {
  kind: FormKind;
  name?: string;
}

/** 신청자에게 보내는 접수 확인 메일 — 브랜드 어조(명사형, 판매 언어 없음) */
export function ApplicantEmail({ kind, name }: ApplicantEmailProps) {
  const t = COPY[kind];
  const hello = name ? `${name} 님,` : null;

  return (
    <Html lang="ko">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.logo}>MUSE DE MARÉE</Text>
          </Section>

          <Section style={styles.content}>
            <Text style={styles.eyebrow}>{t.eyebrow}</Text>
            <Text style={styles.greeting}>{t.greeting}</Text>
            <Hr style={styles.accentLine} />

            {hello && <Text style={styles.intro}>{hello}</Text>}
            {t.body.map((line, i) => (
              <Text key={i} style={styles.paragraph}>
                {line}
              </Text>
            ))}

            <Hr style={styles.divider} />
            <Text style={styles.signature}>Muse de Marée</Text>
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              한국 심해에서 숙성한 샴페인 · musedemaree.com
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
  invite: "초대 신청이 접수되었습니다 — Muse de Marée",
  partner: "파트너 문의가 접수되었습니다 — Muse de Marée",
  brandbook: "브랜드 소개서 요청이 접수되었습니다 — Muse de Marée",
};

const COPY: Record<
  FormKind,
  { eyebrow: string; greeting: string; body: string[] }
> = {
  invite: {
    eyebrow: "OCEAN CELLAR PRIVÉ",
    greeting: "신청이 전해졌습니다",
    body: [
      "인양을 가장 먼저 지켜보는 사람들의 자리에 마음을 더해 주셔서 감사합니다.",
      "자리는 인양된 수량만큼만 열립니다. 초대장은 다음 인양 소식과 함께 전해집니다.",
    ],
  },
  partner: {
    eyebrow: "PARTNERSHIP",
    greeting: "문의가 전해졌습니다",
    body: [
      "함께할 자리를 살펴봐 주셔서 감사합니다.",
      "보내 주신 내용을 검토한 뒤, 담당자가 빠른 시일 안에 연락드립니다.",
    ],
  },
  brandbook: {
    eyebrow: "BRAND",
    greeting: "요청이 전해졌습니다",
    body: [
      "브랜드 소개서를 청해 주셔서 감사합니다.",
      "정리된 소개서를 곧 보내 주신 주소로 전해드립니다.",
    ],
  },
};

const colors = {
  background: "#F2EFE9",
  paper: "#ffffff",
  earth: "#312E2A",
  muted: "#6E675D",
  gold: "#8C6B33",
  border: "#E4DFD7",
  dark: "#1A1714",
};

const styles = {
  body: {
    margin: "0",
    padding: "0",
    backgroundColor: colors.background,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  container: {
    maxWidth: "520px",
    margin: "0 auto",
    backgroundColor: colors.paper,
  },
  header: {
    backgroundColor: colors.dark,
    padding: "32px 40px",
    textAlign: "center" as const,
  },
  logo: {
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontSize: "20px",
    fontWeight: "400" as const,
    letterSpacing: "0.18em",
    color: "#F2EFE9",
    margin: "0",
  },
  content: {
    padding: "48px 40px 40px",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: "500" as const,
    letterSpacing: "0.18em",
    color: colors.gold,
    margin: "0 0 16px 0",
  },
  greeting: {
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontSize: "30px",
    fontWeight: "300" as const,
    color: colors.earth,
    margin: "0 0 16px 0",
  },
  accentLine: {
    width: "32px",
    height: "2px",
    backgroundColor: colors.gold,
    border: "none",
    margin: "0 0 32px 0",
  },
  intro: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: colors.earth,
    margin: "0 0 16px 0",
  },
  paragraph: {
    fontSize: "15px",
    lineHeight: "1.9",
    color: colors.muted,
    margin: "0 0 18px 0",
  },
  divider: {
    height: "1px",
    backgroundColor: colors.border,
    border: "none",
    margin: "16px 0 28px 0",
  },
  signature: {
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontSize: "16px",
    color: colors.earth,
    margin: "0",
    letterSpacing: "0.06em",
  },
  footer: {
    backgroundColor: colors.background,
    padding: "20px 40px",
    textAlign: "center" as const,
    borderTop: `1px solid ${colors.border}`,
  },
  footerText: {
    fontSize: "11px",
    color: colors.muted,
    letterSpacing: "0.04em",
    margin: "0",
  },
};
