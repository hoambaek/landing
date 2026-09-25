import styles from "./bottle.module.css";
import { BOTTLE_COPY, OWNER_CONTACT_EMAIL } from "../_lib/copy";

/**
 * 00 — 병을 찾을 수 없음 (Paper "00 — 병을 찾을 수 없음").
 * 잘못된 코드로 들어왔다. 어느 언어로 온 사람인지 모르므로(쿠키도 없을 수 있다)
 * 한국어 안내 아래 영어 한 줄을 받친다. 문의 메일로만 이어진다.
 */
export default function BottleNotFound() {
  const ko = BOTTLE_COPY.ko;
  const en = BOTTLE_COPY.en;
  return (
    <main className={styles.nfWrap}>
      <div className={styles.nfBox}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo/logo_trans_W.png" alt="Muse de Marée" className={styles.nfSymbol} />
        <span className={styles.nfRule} aria-hidden />
        <div className={styles.nfText}>
          <h1 className={styles.nfTitle}>{ko.notFoundTitle}</h1>
          {/* 줄바꿈을 브라우저에 맡기지 않는다 — 「유효하지 않은 코드이거나 / 아직 등록되지 않은 병입니다.」 */}
          <p className={styles.nfBody}>{ko.notFoundBody.replace("코드이거나 ", "코드이거나\n")}</p>
          <p className={styles.nfBodyEn} lang="en">
            {en.notFoundBody}
          </p>
        </div>
        <a href={`mailto:${OWNER_CONTACT_EMAIL}`} className={styles.nfMail}>
          {OWNER_CONTACT_EMAIL}
        </a>
      </div>
    </main>
  );
}
