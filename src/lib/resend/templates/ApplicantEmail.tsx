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
          {/* ── 헤더 (로고 + 모토) ──
              2026-07-27 흰색 → 블랙. 헤더 바탕이 그레이지(#C4BFBB)라 흰 로고는 명도차가 좁아
              하프톤 점이 뭉개졌다. 블랙은 점 하나하나가 살아난다.
              푸터는 다크 배경이라 계속 흰색(_W)을 쓰고, 본문 서명은 원래 블랙이다. */}
          <Section className="email-header" style={styles.header}>
            <Img
              src={`${BASE_URL}/images/logo/logo_trans.png`}
              width="132"
              height="110"
              alt=""
              style={styles.symbol}
            />
            <Img
              src={`${BASE_URL}/images/logo/logo_text_trans.png`}
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

/* 제목은 여섯 통이 한 벌이다 — 접수 사실은 본문 첫 줄이 담당하고, 제목은 브랜드가 말한다.
   정본 헌법 4조: "톤 일관성은 헤리티지의 대체재다." 같은 브랜드가 보내는 메일 중
   일부만 시스템 알림 어투면 세계관이 아니라 스타일링이 된다. */
const SUBJECT: Record<FormKind, string> = {
  /* "올려 두었습니다" — 네 번째 기둥(소유는 맡아둠이다)의 어법 */
  invite: "초대 명단에 이름을 올려 두었습니다 | Muse de Marée",
  /* 심사 전이므로 약속을 앞세우지 않고 받은 사실만 말한다 */
  partner: "파트너십 문의를 받았습니다 | Muse de Marée",
  brandbook: "바다의 시간을 한 권에 담았습니다 | Muse de Marée",
  bottle: "바다의 시간이 당신의 이름으로 남았습니다 | Muse de Marée",
  /* 짧은 부사 뒤 쉼표는 영어 문두 부사구 관행이다 — 일곱 제목 중 여기만 쉼표가 있었다 */
  newsletter: "계절마다 바다의 소식을 전하겠습니다 | Muse de Marée",
};

/** 브랜드 소개서 접수 확인(ack) 전용 제목·본문 */
const BRANDBOOK_ACK_SUBJECT =
  "소개서를 준비하고 있습니다 | Muse de Marée";

const BRANDBOOK_ACK_COPY = {
  eyebrow: "BRAND",
  title: "소개서를 준비하고 있습니다",
  body: [
    /* "요청은 잘 받았습니다."를 뺐다 — 앞 절의 "요청해 주셔서 감사합니다"가 이미 접수를 말한다 */
    "Muse de Marée 브랜드 소개서를 요청해 주셔서 감사합니다.",
    /* 지연을 두 번 말하지 않는다("확인한 뒤" + "준비되는 대로"). 확인 절차만 남기고,
       한 문장 안에서 겹치던 "보내 주신"·"보내 드리겠습니다"는 뒤쪽을 "전해"로 풀었다 */
    "보내 주신 정보를 확인한 뒤 이 메일로 소개서를 전해 드리겠습니다.",
    /* "소개서와 함께"를 뺐다 — 바로 앞 문장이 이미 소개서를 보낸다고 말했다 */
    "곧 다시 인사드리겠습니다.",
  ],
};

const COPY: Record<
  FormKind,
  { eyebrow: string; title: string; body: string[] }
> = {
  /* 2026-07-27 — 다섯 통 전체를 병 메일 기준선에 맞췄다(대표 판정: "이게 일반적인 톤이다").
     기준선에서 읽히는 규칙 넷:
       ① 첫 문장은 감사로 열고, 목적어는 브랜드명 + 구체 명사(브랜드명 단독 금지)
       ② 문단1의 두 번째 문장은 접수 확인을 되풀이하지 않고 상태 변화를 말한다
       ③ 쉼표를 쓰지 않는다 — 승인된 병 메일에 쉼표가 하나도 없다. 마침표로 끊는다
       ④ 과잉 수사 금지. 짧은 문장, 관찰 일기체
     ②·③이 안 되는 자리는 억지로 맞추지 않았다. 없는 내용을 지어내는 쪽이 더 나쁘다. */
  invite: {
    eyebrow: "OCEAN CELLAR PRIVÉ",
    title: "초대 명단에 이름을 올려 두었습니다",
    body: [
      /* 둘째 문장을 "명단에 이름을 올려 두었습니다"로 바꾸자는 제안은 기각했다 —
         제목과 거의 그대로 겹친다. 대체할 다른 사실이 없어 접수 확인을 유지한다. */
      "Ocean Cellar Privé 초대를 신청해 주셔서 감사합니다. 신청은 잘 받아 두었습니다.",
      "멤버십은 인양되는 수량에 맞춰 소수의 자리만 열립니다. 다음 모집이 시작되면 가장 먼저 초대장을 보내 드리겠습니다.",
      /* 서브페이지 successNote("초대장은 다음 인양 소식과 함께 전해집니다")와 수미 일치 */
      "다음 인양 소식과 함께 다시 인사드리겠습니다.",
    ],
  },
  partner: {
    eyebrow: "PARTNERSHIP",
    /* 심사 전이므로 약속을 앞세우지 않고 받은 사실만 말한다 — 제목은 유지.
       대신 본문에서 "문의는 잘 받았습니다"를 걷어냈다. 제목과 같은 말이었다. */
    title: "파트너십 문의를 받았습니다",
    body: [
      "Muse de Marée 파트너십에 관심 가져 주셔서 감사합니다. 보내 주신 내용은 담당자에게 전했습니다.",
      "영업일 기준 2일 이내에 제안서와 함께 회신드리겠습니다.",
      /* 페이지 부제("바다의 시간을 테이블 위에 놓는 일")를 받는다 */
      "테이블에서 뵙기를 기다리겠습니다.",
    ],
  },
  brandbook: {
    eyebrow: "BRAND",
    title: "브랜드 소개서를 보내 드립니다",
    body: [
      "Muse de Marée 브랜드 소개서를 요청해 주셔서 감사합니다. 소개서를 이 메일에 함께 보내 드립니다.",
      /* "심해"는 과장이다 — 수심 30m는 심해가 아니고, 정본 표기는 "남해 수심 30m".
         헌법 1조: 숫자는 형용사보다 조용하다.
         한 문장에 나열 넷을 싣고 있어 둘로 나눴다. 제목과 겹치던 "한 권에 담았습니다"도 같이 풀렸다.
         여기 "숙성하는"은 현재형이지만 브랜드의 상시 관행을 말하는 자리라 §6 시점 규칙 대상이 아니다. */
      "한국 남해 수심 30m에서 숙성하는 샴페인의 철학과 기록 방식을 담았습니다. 퀴베 라인업과 파트너십 안내도 함께 실었습니다.",
      /* "자리에 대해"는 A-1(S1) 번역투다. 목적격으로 직결하려면 "이야기 나누다"를 "이야기하다"로
         바꿔야 한다 — "이야기 나누다"는 이미 "이야기"를 목적어로 물고 있다. */
      "함께할 자리를 더 이야기하고 싶으시면 언제든 이 메일로 회신해 주세요.",
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
       수심은 정본 표기 "남해 수심 30m".

       ⚠️ 시점 (2026-07-27 대표 지시 · 정본 §6) — 인양이 끝나고 제품을 수령해
       손에 들고 있는 사람이 읽는 메일이다. 숙성은 이미 끝난 사건이므로 완료형만 쓴다.
       전에는 "한국 남해에서 숙성합니다"라고 현재형으로 적어 두어, 방금 등록한 병이
       아직 바다에 있는 것처럼 읽혔다. 진행형은 문체 문제가 아니라 사실 오류다.
       같은 판정이 BottleRecord.tsx 수렴 문구 주석에 이미 있었는데 메일만 따르지 않았다. */
    body: [
      /* 첫 줄은 감사로 연다 — 나머지 네 통(초대·파트너십·브랜드북·뉴스레터)이 모두 그렇게 열고
         병 메일만 예외였다. 앞선 초안은 "바다에서 보낸 시간이 끝났습니다"로 시작했는데,
         시제는 맞았지만 첫 단어가 "끝났다"라 닫는 어감이었다.
         목적어는 "Muse de Marée의 샴페인" — 네 통 모두 브랜드명 + 구체 명사를 쓴다
         ("초대를"·"파트너십에"·"브랜드 소개서를"·"의 소식을"). 브랜드명 단독은 이 세트에 없고,
         소장하는 대상도 브랜드가 아니라 샴페인이다. */
      "Muse de Marée의 샴페인을 소장해 주셔서 감사합니다. 바다에서 시간을 보낸 한 병이 당신의 이름 아래 놓였습니다.",
      /* "이 병이"를 지운다 — 정본 개체 지칭 규칙(2026-07-25)은 "이 병은"을 브랜드 서사
         최상위 한 자리(전환 히어로)에 한정하고 실행 지면 복제를 금지한다. 앞 문장이
         이미 대상을 세웠으므로 규칙 2대로 부르지 않고 기록을 주어로 남긴다.
         "양조하고," 뒤 쉼표는 걷어냈다 — 연결어미 뒤 쉼표는 한국어 AI 문투의 표지다(C-11).
         "그 기록"이 아니라 "숙성 기록"이다 — 앞 문장에 "기록"이라는 명사가 없어서
         "그"가 가리킬 선행사가 없었다. 독자가 동사에서 명사를 지어내 채워야 했다. */
      "프랑스 샹파뉴에서 양조해 한국 남해 수심 30m에서 숙성했습니다. 숙성 기록은 태그로 언제든 다시 열어볼 수 있습니다.",
      /* 여기 "인양"은 앞으로 있을 다른 인양이다 — 방금 등록한 병의 인양은 이미 끝났다 */
      "다음 인양과 새 기록의 소식을 이 메일로 가장 먼저 전해 드리겠습니다.",
    ],
  },
  newsletter: {
    eyebrow: "JOURNAL",
    /* 감사는 본문 첫 줄이 담당한다 — 제목은 앞으로 무엇이 오는지를 말한다 */
    title: "계절마다 바다의 소식",
    body: [
      /* 한 문장뿐이다. 구독 확인은 전할 사실이 이것뿐이라 두 문장으로 늘리려면 없는 말을 지어내야 한다 */
      "Muse de Marée의 소식을 구독해 주셔서 감사합니다.",
      /* "계절에 맞춰 가끔"을 "계절마다"로. 제목이 계절마다라고 약속해 놓고 본문에서 "가끔"으로
         물러서면 두 약속이 어긋난다. 계절마다면 그 자체로 드문 빈도라 "가끔"은 덧말이기도 하다. */
      /* "새로운 기록" → "새 기록". 병 메일이 "새 기록"이라 세트 안에서 갈려 있었다 */
      "다음 인양과 새 기록, 바다의 시간에 관한 이야기를 계절마다 전해 드리겠습니다.",
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
