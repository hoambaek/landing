import styles from "./bottle.module.css";
import { BOTTLE_COPY } from "../_lib/copy";

export default function BottleNotFound() {
  const ko = BOTTLE_COPY.ko;
  const en = BOTTLE_COPY.en;
  return (
    <main className={styles.nfWrap}>
      <div className={styles.nfBox}>
        <p className={styles.nfTitle}>{ko.notFoundTitle}</p>
        <p className={styles.nfBody}>{ko.notFoundBody}</p>
        <p className={styles.nfBody}>{en.notFoundBody}</p>
      </div>
    </main>
  );
}
