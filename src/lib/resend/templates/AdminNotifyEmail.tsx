import {
  Html,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import type { FormKind } from "./ApplicantEmail";

interface AdminNotifyEmailProps {
  kind: FormKind;
  /** 표로 렌더할 제출 필드 (라벨 → 값) */
  fields: Record<string, string>;
  /** 접수 시각 (KST 포맷 문자열) */
  receivedAt: string;
}

/** 운영자에게 보내는 신규 신청 알림 — 정보 명확성 우선 */
export function AdminNotifyEmail({
  kind,
  fields,
  receivedAt,
}: AdminNotifyEmailProps) {
  const label = KIND_LABEL[kind];

  return (
    <Html lang="ko">
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.badge}>{label}</Text>
            <Text style={styles.title}>새 {label}이(가) 접수되었습니다</Text>
          </Section>

          <Section style={styles.content}>
            <table cellPadding="0" cellSpacing="0" style={styles.table}>
              <tbody>
                {Object.entries(fields).map(([k, v]) => (
                  <tr key={k}>
                    <td style={styles.thCell}>{k}</td>
                    <td style={styles.tdCell}>{v || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Hr style={styles.divider} />
            <Text style={styles.meta}>접수 시각 · {receivedAt}</Text>
            <Text style={styles.meta}>
              Supabase · {TABLE_LABEL[kind]} 테이블에 저장됨
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function getAdminSubject(kind: FormKind): string {
  return `[Muse de Marée] 새 ${KIND_LABEL[kind]}`;
}

const KIND_LABEL: Record<FormKind, string> = {
  invite: "초대 신청",
  partner: "파트너 문의",
  brandbook: "브랜드 소개서 요청",
  bottle: "병 소유자 등록",
  newsletter: "뉴스레터 구독",
};

const TABLE_LABEL: Record<FormKind, string> = {
  invite: "invitations",
  partner: "partner_inquiries",
  brandbook: "brandbook_requests",
  bottle: "bottle_registrations",
  newsletter: "newsletter_subscribers",
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
    padding: "24px 0",
    backgroundColor: colors.background,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  container: {
    maxWidth: "520px",
    margin: "0 auto",
    backgroundColor: colors.paper,
    border: `1px solid ${colors.border}`,
  },
  header: {
    padding: "28px 32px 20px",
    borderBottom: `1px solid ${colors.border}`,
  },
  badge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "600" as const,
    letterSpacing: "0.12em",
    color: colors.gold,
    margin: "0 0 8px 0",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600" as const,
    color: colors.earth,
    margin: "0",
  },
  content: {
    padding: "24px 32px 32px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  thCell: {
    width: "96px",
    fontSize: "12px",
    fontWeight: "600" as const,
    letterSpacing: "0.04em",
    color: colors.muted,
    padding: "10px 12px 10px 0",
    verticalAlign: "top" as const,
    borderBottom: `1px solid ${colors.border}`,
    whiteSpace: "nowrap" as const,
  },
  tdCell: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: colors.earth,
    padding: "10px 0",
    verticalAlign: "top" as const,
    borderBottom: `1px solid ${colors.border}`,
    whiteSpace: "pre-wrap" as const,
  },
  divider: {
    height: "1px",
    backgroundColor: colors.border,
    border: "none",
    margin: "24px 0 16px 0",
  },
  meta: {
    fontSize: "12px",
    color: colors.muted,
    margin: "0 0 4px 0",
  },
};
