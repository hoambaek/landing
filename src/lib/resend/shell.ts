/**
 * HTML 문자열 메일의 껍데기 — react-email을 거치지 않는 서버 액션 메일(소유자 인증 코드 등)용.
 * Paper NFC 페이지 "03B-M — 확인 코드 메일" 기준: 520px 카드 · 로고 헤더 · 금색 헤어라인 · 라이트 푸터.
 * 신청 확인 메일(ApplicantEmail)과 같은 토큰(theme.ts)을 쓴다.
 *
 * 레이아웃은 전부 table이다 — Outlook(Word 렌더러)은 div의 max-width·margin auto·flex를 읽지 못한다.
 * 여백 기본값은 좁은 화면(375) 기준이다 — 네이버 메일 앱처럼 <style>의 @media를 버리는 클라이언트가 있어
 * 모바일 보정이 아니라 인라인 기본값이 폰에서 맞아야 한다(Paper "03B-M 모바일", 2026-09-26).
 * inner에는 카드 안에 들어갈 <tr>…</tr> 행을 넘긴다.
 */
import {
  MAIL_BASE_URL,
  MAIL_COLOR as C,
  MAIL_FONT as F,
  MAIL_FONT_HREF,
  MAIL_FOOTER_INFO,
  MAIL_MOTTO,
  MAIL_COPYRIGHT,
  type MailLocale,
} from "./theme";

/** 본문에 값을 끼울 때 쓰는 최소 이스케이프 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function mailShell({
  inner,
  preheader,
  locale = "ko",
}: {
  inner: string;
  /** 받은 편지함 목록에서 제목 옆에 보이는 한 줄. 본문에는 나타나지 않는다 */
  preheader?: string;
  locale?: MailLocale;
}): string {
  /* 프리헤더 뒤 공백 문자열 — 없으면 클라이언트가 본문 첫 글자들을 이어 붙여 미리보기에 보인다 */
  const pad = "&#847;&zwnj;&nbsp;".repeat(40);
  const pre = preheader
    ? `<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${C.canvas}">${escapeHtml(preheader)}${pad}</div>`
    : "";
  const footerInfo = MAIL_FOOTER_INFO[locale].map(escapeHtml).join("<br />");

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<link href="${MAIL_FONT_HREF}" rel="stylesheet" />
<style>
  @media only screen and (max-width: 480px) {
    .m-outer { padding: 0 !important; }
    .m-card { border: 0 !important; max-width: 100% !important; }
    .m-head { padding: 40px 24px 0 !important; }
    .m-pad { padding-left: 24px !important; padding-right: 24px !important; }
    .m-foot { padding: 28px 24px 32px !important; }
    .m-foot-info { font-size: 10px !important; line-height: 17px !important; }
    /* 인증 메일 안내 첫 줄(N° · 퀴베 · 연도)이 390px 폭에서 한 어절만 넘어가 외톨이 줄이 생긴다 — 한 단계 줄인다 */
    .m-lead { font-size: 14px !important; line-height: 24px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.canvas};-webkit-text-size-adjust:100%">
${pre}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.canvas}">
  <tr>
    <td class="m-outer" align="center" style="padding:24px 12px">
      <table class="m-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:520px;background:${C.paper};border:0.5px solid ${C.line};border-collapse:separate">
        <tr>
          <td class="m-head" align="center" style="padding:44px 24px 0">
            <img src="${MAIL_BASE_URL}/images/logo/logo_trans.png" width="64" height="53" alt="" style="display:block;margin:0 auto;border:0" />
            <img src="${MAIL_BASE_URL}/images/logo/logo_text_trans.png" width="95" height="14" alt="MUSE DE MARÉE" style="display:block;margin:14px auto 0;border:0" />
            <div style="width:28px;height:0;margin:14px auto 0;border-top:0.5px solid ${C.gold};font-size:0;line-height:0">&nbsp;</div>
          </td>
        </tr>
        ${inner}
        <tr>
          <td class="m-foot" align="center" style="padding:30px 24px 34px;background:${C.paperDeep};border-top:0.5px solid ${C.line};text-align:center">
            <div style="font-family:${F.latin};font-size:17px;font-style:italic;line-height:22px;color:${C.body}">${MAIL_MOTTO}</div>
            <div class="m-foot-info" style="margin-top:12px;font-family:${F.sans};font-size:10.5px;line-height:17px;color:${C.muted}">${footerInfo}</div>
            <div style="margin-top:12px;font-family:${F.latin};font-size:10px;font-weight:500;letter-spacing:.28em;line-height:12px;color:${C.faint}">${MAIL_COPYRIGHT}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
