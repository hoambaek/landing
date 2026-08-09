import { Fragment } from "react";
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
 * 본문 한 줄은 문단(string)이거나 목록 블록이다.
 * 목록을 body 배열 안에 넣는 이유는 순서 때문이다 — 뉴스레터는 목록이
 * 마지막 문단 앞에 오므로, body 뒤에 별도 필드로 붙이면 순서를 표현할 수 없다.
 * 여섯 통 중 목록을 쓰는 건 뉴스레터 하나뿐이라 나머지는 string만 담는다.
 */
type ListBlock = {
  heading: string;
  items: { name: string; desc: string }[];
};

type EmailCopy = {
  eyebrow: string;
  title: string;
  body: (string | ListBlock)[];
};

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
  /** 병 번호 — bottle 메일의 헤드라인이 개체를 번호로 부른다. 없으면 부르지 않는다 */
  serial?: number | null;
}

/** 발송 메일의 이미지(로고)용 절대 URL */
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://musedemaree.com";

/**
 * 신청자 확인 메일 — Paper v2 시안(프레임 + 카드 + 법적 푸터).
 * 외곽 연회색 프레임 안에 #C4BFBB 카드, 브랜드 로고 헤더, 본문, 다크 법적 푸터.
 */
export function ApplicantEmail({ kind, name, mode = "send", serial = null }: ApplicantEmailProps) {
  const t =
    kind === "brandbook" && mode === "ack" ? BRANDBOOK_ACK_COPY : COPY[kind];
  const greeting = name ? `${name} 님, 안녕하세요.` : "안녕하세요.";
  /* 번호가 있으면 헤드라인이 개체를 부르고, 없으면 부르지 않는다(정본 규칙 2) */
  const title =
    kind === "bottle" && serial == null ? BOTTLE_TITLE_NO_SERIAL : t.title.replace("{serial}", String(serial));

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
              {title}
            </Text>
            <Text style={styles.hello}>{greeting}</Text>
            {/* 목록은 ul/li 대신 Text 반복이다 — 클라이언트마다 li 기본 여백이 달라
                간격을 통제할 수 없다. 불릿은 문자 ·, 마지막 항목만 아래 여백을 벌려
                뒤따르는 문단이 목록에 붙지 않게 한다(문단 para는 margin-top이 0이다). */}
            {t.body.map((line, i) =>
              typeof line === "string" ? (
                <Text key={i} style={styles.para}>
                  {line}
                </Text>
              ) : (
                <Fragment key={i}>
                  <Text style={styles.listHeading}>{line.heading}</Text>
                  {line.items.map((item, j) => (
                    <Text
                      key={item.name}
                      style={
                        j === line.items.length - 1
                          ? { ...styles.listItem, marginBottom: "26px" }
                          : styles.listItem
                      }
                    >
                      {"· "}
                      <span style={styles.listName}>{item.name}</span>
                      {` — ${item.desc}`}
                    </Text>
                  ))}
                </Fragment>
              )
            )}
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

export function getApplicantSubject(
  kind: FormKind,
  mode: EmailMode = "send",
  serial: number | null = null
): string {
  if (kind === "brandbook" && mode === "ack") return BRANDBOOK_ACK_SUBJECT;
  /* 개체는 번호로 부른다. 번호가 없으면 부르지 않는다(정본 규칙 2) */
  if (kind === "bottle" && serial == null) return BOTTLE_SUBJECT_NO_SERIAL;
  return SUBJECT[kind].replace("{serial}", String(serial));
}

/** 번호 미부여 병 — 제목·헤드라인 모두 번호 없이 선다 */
const BOTTLE_SUBJECT_NO_SERIAL = "소유자로 등록했습니다 | Muse de Marée";
const BOTTLE_TITLE_NO_SERIAL = "소유자로 등록했습니다";

/* 제목은 여섯 통이 한 벌이다 — 접수 사실은 본문 첫 줄이 담당하고, 제목은 브랜드가 말한다.
   정본 헌법 4조: "톤 일관성은 헤리티지의 대체재다." 같은 브랜드가 보내는 메일 중
   일부만 시스템 알림 어투면 세계관이 아니라 스타일링이 된다. */
const SUBJECT: Record<FormKind, string> = {
  /* "올려 두었습니다" → "올렸습니다"(2026-08-03 대표 확정). 네 번째 기둥(소유는 맡아둠이다)의
     어법이었지만 보조용언이 붙어 읽기가 걸렸고, 모바일에서 "올려 / 두었습니다"로 갈리기도 했다 */
  invite: "초대 명단에 이름을 올렸습니다 | Muse de Marée",
  /* 심사 전이므로 약속을 앞세우지 않고 받은 사실만 말한다 */
  partner: "파트너십 문의를 받았습니다 | Muse de Marée",
  brandbook: "바다의 시간을 한 권에 담았습니다 | Muse de Marée",
  /* {serial} 치환 — 번호 없는 병은 BOTTLE_SUBJECT_NO_SERIAL로 갈린다 */
  bottle: "N° {serial}의 소유자로 등록했습니다 | Muse de Marée",
  /* 짧은 부사 뒤 쉼표는 영어 문두 부사구 관행이다 — 일곱 제목 중 여기만 쉼표가 있었다 */
  newsletter: "계절마다 바다의 소식을 전하겠습니다 | Muse de Marée",
};

/** 브랜드 소개서 접수 확인(ack) 전용 제목·본문 */
const BRANDBOOK_ACK_SUBJECT =
  "소개서를 준비하고 있습니다 | Muse de Marée";

/* ack도 COPY와 같은 렌더 경로를 타므로 같은 타입을 붙인다 — 두 값의 body가
   서로 다른 배열 타입으로 추론되면 t.body.map() 자리에서 합집합이 되어 호출이 막힌다 */
const BRANDBOOK_ACK_COPY: EmailCopy = {
  eyebrow: "BRAND",
  title: "소개서를 준비하고 있습니다",
  body: [
    /* "요청은 잘 받았습니다."를 뺐다 — 앞 절의 "요청해 주셔서 감사합니다"가 이미 접수를 말한다 */
    "Muse de Marée 브랜드 소개서를 요청해 주셔서 감사합니다.",
    /* 지연을 두 번 말하지 않는다("확인한 뒤" + "준비되는 대로"). 확인 절차만 남기고,
       한 문장 안에서 겹치던 "보내 주신"·"보내 드리겠습니다"는 뒤쪽을 "전해"로 풀었다 */
    /* 맺음 문장("곧 다시 인사드리겠습니다")을 걷어냈다(2026-08-03 대표 확정) —
       바로 앞 문장이 이미 "확인한 뒤 전해 드리겠습니다"라고 말해 같은 내용이었고,
       "다시 인사드리겠습니다"가 초대 메일과 겹쳐 세트 안에서 상투구가 되고 있었다.
       두 문단으로 서는 건 문제가 아니다 — 전할 사실이 둘뿐이다. */
    "보내 주신 정보를 확인한 뒤 이 메일로 소개서를 전해 드리겠습니다.",
  ],
};

const COPY: Record<FormKind, EmailCopy> = {
  /* 2026-07-27 — 다섯 통 전체를 병 메일 기준선에 맞췄다(대표 판정: "이게 일반적인 톤이다").
     기준선에서 읽히는 규칙 넷:
       ① 첫 문장은 감사로 열고, 목적어는 브랜드명 + 구체 명사(브랜드명 단독 금지)
       ② 문단1의 두 번째 문장은 접수 확인을 되풀이하지 않고 상태 변화를 말한다
       ③ 쉼표를 쓰지 않는다 — 승인된 병 메일에 쉼표가 하나도 없다. 마침표로 끊는다
       ④ 과잉 수사 금지. 짧은 문장, 관찰 일기체
     ②·③이 안 되는 자리는 억지로 맞추지 않았다. 없는 내용을 지어내는 쪽이 더 나쁘다. */
  invite: {
    eyebrow: "OCEAN CELLAR PRIVÉ",
    title: "초대 명단에 이름을 올렸습니다",
    body: [
      /* 접수 확인 문장("신청은 잘 받아 두었습니다")을 걷어냈다 — 대표 지시(2026-08-02):
         "일반적으로 그런 문장은 안 쓴다". 감사 문장이 접수를 이미 함의하고,
         제목의 "올려 두었습니다"와 "두다"가 두 줄 연속으로 겹치기도 했다.
         한 문장으로 서는 건 뉴스레터가 먼저 한 형태다 — 이제 이 세트의 기본형으로 본다. */
      "Ocean Cellar Privé 초대를 신청해 주셔서 감사합니다.",
      /* "소수의 자리만"은 a small number of seats의 번역투다(2026-08-03).
         한정은 "만큼만"이 맡고, 주어를 "멤버십 자리"로 당겨 앞부분의 군더더기도 걷었다 */
      "멤버십 자리는 인양되는 수량만큼만 열립니다. 다음 모집이 시작되면 가장 먼저 초대장을 보내 드리겠습니다.",
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
      /* "보내 주신 내용은 담당자에게 전했습니다"도 같은 판정으로 걷어냈다(2026-08-02) —
         접수 확인의 변형인 데다 "담당자"는 관공서 어투라 관찰 일기체에서 벗어난다.
         실제로 이 메일을 읽고 회신하는 사람은 대표다. */
      "Muse de Marée 파트너십에 관심 가져 주셔서 감사합니다.",
      "영업일 기준 2일 이내에 제안서와 함께 회신드리겠습니다.",
      /* 페이지 부제("바다의 시간을 테이블 위에 놓는 일")를 받는다 */
      "테이블에서 뵙기를 기다리겠습니다.",
    ],
  },
  brandbook: {
    eyebrow: "BRAND",
    /* "브랜드 소개서를 보내 드립니다" → "소개서가 준비되었습니다"(2026-08-03 대표 확정).
       보조용언이 모바일에서 "보내 / 드립니다"로 갈렸고, 본문 첫 줄에도 "브랜드 소개서"가 또 나왔다.
       접수확인 제목("소개서를 준비하고 있습니다")과 준비 중 → 준비됨으로 짝이 맞는다. */
    title: "소개서가 준비되었습니다",
    body: [
      /* "소개서를 이 메일에 함께 보내 드립니다"를 걷어냈다(2026-08-02) — 제목이 이미 같은 말을 하고,
         한 문장에 "소개서"가 두 번 나왔다. "함께"는 첨부를 에두른 말이라 무엇과 함께인지도 흐렸다.
         첨부가 있다는 사실은 제목과 다음 문단(소개서 내용)이 충분히 전한다. */
      "Muse de Marée 브랜드 소개서를 요청해 주셔서 감사합니다.",
      /* "심해"는 과장이다 — 수심 30m는 심해가 아니고, 정본 표기는 "남해 수심 30m".
         헌법 1조: 숫자는 형용사보다 조용하다.
         한 문장에 나열 넷을 싣고 있어 둘로 나눴다. 제목과 겹치던 "한 권에 담았습니다"도 같이 풀렸다.
         여기 "숙성하는"은 현재형이지만 브랜드의 상시 관행을 말하는 자리라 §6 시점 규칙 대상이 아니다. */
      /* "퀴베 라인업" → "에디션 라인업" (2026-08-02 대표 확정, Paper 시안 기준으로 코드를 맞췄다).
         랜딩 전반에서 퀴베는 샴페인 제품 라인을, 에디션은 개체·회차를 맡아 왔는데 이 자리는 후자를 쓴다. */
      "한국 남해 수심 30m에서 숙성하는 샴페인의 철학과 기록 방식을 담았습니다. 에디션 라인업과 파트너십 안내도 함께 실었습니다.",
      /* "함께할 자리를 더 이야기하고"를 버렸다(2026-08-02). 가장 큰 문제는 "더"였다 —
         소개서를 처음 받는 사람에게 쓰면 앞선 대화가 있었다는 전제를 깔아버린다.
         "자리를 이야기하다"도 목적격으로 붙지 않고, 절이 셋이라 늘어졌다. */
      "궁금한 점이 있으면 언제든 이 메일로 회신해 주세요.",
    ],
  },
  bottle: {
    eyebrow: "OCEAN CELLAR™",
    /* 2026-08-08 대표 확정 — "병에 이름을 새겼습니다"에서 교체.
       인증서는 디지털이라 새기는 것이 없다. "새기다"는 물건에 붙는 동사고
       "등록"은 명부에 붙는 동사라, 처소도 "병에"에서 "N° {serial}의 소유자로"로 함께 옮겼다
       ("병에 등록"은 성립하지 않는다 — 등록되는 곳은 병이 아니라 기록부다).
       피동("등록되었습니다") 대신 능동 완료를 쓴다 — 여섯 통 중 넷이 이 어형이고
       ("올렸습니다"·"받았습니다"·"담았습니다") 피동은 결제·접수 알림 어조로 내려앉는다.
       종전 판정("바다의 시간이 당신의 이름으로 남았습니다"가 오글거린다)은 그대로 유효하다 —
       "남다"로 되돌아가지 않는 이유다. */
    title: "N° {serial}의 소유자로 등록했습니다",
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
      /* 뒷문장("바다에서 시간을 보낸 한 병이 당신의 이름 아래 놓였습니다")을 걷어냈다(2026-08-03) —
         제목과 같은 사실이고 "이름 아래 놓였다"가 이 세트에서 가장 과한 수사였다.
         감사 한 문장으로 서는 건 나머지 다섯 통이 이미 그렇다. */
      "Muse de Marée의 샴페인을 소장해 주셔서 감사합니다.",
      /* "이 병이"를 지운다 — 정본 개체 지칭 규칙(2026-07-25)은 "이 병은"을 브랜드 서사
         최상위 한 자리(전환 히어로)에 한정하고 실행 지면 복제를 금지한다. 앞 문장이
         이미 대상을 세웠으므로 규칙 2대로 부르지 않고 기록을 주어로 남긴다.
         "양조하고," 뒤 쉼표는 걷어냈다 — 연결어미 뒤 쉼표는 한국어 AI 문투의 표지다(C-11).
         "그 기록"이 아니라 "숙성 기록"이다 — 앞 문장에 "기록"이라는 명사가 없어서
         "그"가 가리킬 선행사가 없었다. 독자가 동사에서 명사를 지어내 채워야 했다. */
      /* "언제든"을 뺐다 — "다시 열어볼 수 있습니다"가 이미 상시 가능함을 말한다 */
      "프랑스 샹파뉴에서 양조해 한국 남해 수심 30m에서 숙성했습니다. 숙성 기록은 태그로 다시 열어볼 수 있습니다.",
      /* 여기 "인양"은 앞으로 있을 다른 인양이다 — 방금 등록한 병의 인양은 이미 끝났다 */
      /* "~의 소식을" → "~을". 인양과 기록 자체가 소식이라 덧말이었다 */
      "다음 인양과 새 기록을 이 메일로 가장 먼저 전해 드리겠습니다.",
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
      /* 2026-08-02 — 세 가지가 한 문장에 겹쳐 있었다.
         ① 여섯 통 중 유일한 쉼표였다(세트 규칙 ③ 위반)
         ② "바다의 시간에 관한 이야기"는 앞 둘을 포괄하는 상위 개념인데 구체 둘과 나란히 놓여 층위가 어긋났다
         ③ 다음 문단도 "전해 드리겠습니다"로 끝나 같은 동사구가 연속됐고, 길이 탓에 "전해 / 드리겠습니다"가
            줄바꿈에 갈렸다. 짧게 줄이고 동사를 "보내"로 갈라 셋을 한 번에 풀었다. */
      "다음 인양과 새 기록을 계절마다 보내 드리겠습니다.",
      /* 목록은 여섯 통 중 여기에만 있다 — 구독은 앞으로 받을 것을 미리 보여줄 수 있는
         유일한 메일이고, 나머지 다섯 통은 이미 일어난 일을 알린다.
         마지막 문단 앞자리다. 뒤에 붙이면 "첫 소식이 준비되면"이 목록보다 앞서게 된다. */
      {
        heading: "보내 드릴 소식",
        items: [
          { name: "새 저널 글", desc: "바다에서 기록한 이야기" },
          { name: "바다의 관측 일지", desc: "수심 30m의 숙성 기록" },
          { name: "인양 소식", desc: "다음 인양 일정과 결과" },
          { name: "페어링 레시피", desc: "퀴베에 맞춘 음식 제안" },
        ],
      },
      /* "받은 편지함에서 곧 다시 인사드리겠습니다"를 버렸다(2026-08-02). "받은 편지함"은 Gmail UI 용어라
         브랜드 문장에 섞이면 튀고, 앞 문장이 "계절마다"로 빈도를 정해 놓고 여기서 "곧"이라고 해
         두 약속이 어긋났다. 다음 계절은 곧이 아니다. 시점을 단정하지 않는 쪽으로 바꿨다. */
      "첫 소식이 준비되면 전해 드리겠습니다.",
    ],
  },
};

/* ── 스타일 (Paper v2 토큰, 이메일 인라인) ── */
/* 제목 전용 스택. 메일 제목은 현재 전부 한글이라 실질적으로 한글 세리프가 결정한다.
   이메일은 웹폰트(@font-face)가 Gmail·Outlook에서 막히므로 수신자 기기에 설치된 것만 잡힌다.
   그래서 되는 환경만 챙긴다 — 랜딩 정본과 같은 Noto Serif KR을 먼저 두고,
   안드로이드가 같은 폰트를 "Noto Serif CJK KR"로 등록하는 경우를 뒤에서 덮는다.
   둘 다 없으면 끝의 serif가 시스템 명조(맥 AppleMyungjo / 윈도우 바탕)로 받는다.
   iOS에는 한글 세리프가 없어 고딕으로 떨어지는데, 이건 어느 스택을 써도 같다. */
const serif =
  '"Cormorant Garamond", "Noto Serif KR", "Noto Serif CJK KR", Georgia, serif';
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
  /* 목록 소제목 — 세리프 제목과 구분되게 sans를 쓰고, 굵기(500)와 본문색(#312E2A)으로만
     문단과 층위를 가른다. 위 여백이 문단 간격(14px)보다 넓어야 목록이 앞 문단에 딸려 붙지 않는다 */
  listHeading: {
    margin: "26px 0 12px",
    fontFamily: sans,
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "26px",
    color: "#312E2A",
    wordBreak: "keep-all" as const,
  },
  listItem: {
    margin: "0 0 8px",
    fontFamily: sans,
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "28px",
    color: "#4A453F",
    wordBreak: "keep-all" as const,
  },
  /* 항목명만 본문색으로 올린다 — 굵기를 건드리면 소제목과 무게가 겹친다 */
  listName: {
    color: "#312E2A",
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
