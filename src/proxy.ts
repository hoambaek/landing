import { NextResponse, type NextRequest } from "next/server";

/**
 * /b 요청 레이트 리밋 — NFC 코드 대량 탐색 차단.
 *
 * /b/{code}는 태그로 열리는 공개 주소다. 코드를 맞히면 그 병의 소유자 이름과
 * 소장품 목록이 열리므로, 코드를 무작위로 훑는 시도를 막아야 한다.
 *
 * 기준을 "요청 수"로 잡으면 정상 사용자와 탐색자가 구분되지 않는다. 한 사람이
 * 입장·기록·인증서·소유 화면을 오가며 프리페치까지 일으키면 수십 건이 금방 쌓인다.
 * 갈리는 지점은 다른 데 있다 — 정상 사용자는 자기 병 한둘을 여는 반면,
 * 탐색자는 매번 다른 코드를 두드린다. 그래서 IP마다 "서로 다른 코드 수"를 센다.
 *
 * 두 겹이다.
 *  - 10분에 서로 다른 코드 30개까지. 선물받은 병을 여러 개 열어봐도 닿지 않고,
 *    62^8을 훑으려는 쪽에는 사실상 불가능해진다.
 *  - 1분에 600건까지. 코드 하나를 향한 단순 홍수를 막는 뚜껑이다.
 *
 * 한계를 분명히 해둔다. 카운터는 인스턴스 메모리에 있다. 서버리스에서 인스턴스가
 * 여러 개면 각자 세므로 실제 상한은 이 값보다 느슨하고, 여러 IP로 나눠 오는 시도는
 * 막지 못한다. 외부 저장소(Redis 등) 없이 얻을 수 있는 만큼만 얻는 장치다.
 */

const CODE_WINDOW_MS = 10 * 60_000;
const MAX_CODES = 30; // 10분 내 서로 다른 코드

const FLOOD_WINDOW_MS = 60_000;
const MAX_HITS = 600; // 1분 내 총 요청

/* 추적 대상 상한 — IP를 바꿔가며 두드려 이 맵을 부풀리는 것 자체가 공격이 된다 */
const MAX_TRACKED = 20_000;

type Entry = { codes: Map<string, number>; hits: number[] };
const seen = new Map<string, Entry>();

function clientIp(req: NextRequest): string {
  /* Vercel은 x-forwarded-for 맨 앞에 실제 클라이언트를 둔다.
     헤더가 없으면(로컬·직접 호출) 한 덩어리로 묶어 센다. */
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** /b/{code}/… 에서 code만. 없으면 null(=코드 수에 세지 않음) */
function bottleCode(pathname: string): string | null {
  const seg = pathname.split("/")[2];
  return seg && /^[A-Za-z0-9]{4,12}$/.test(seg) ? seg : null;
}

function sweep(now: number) {
  if (seen.size <= MAX_TRACKED) return;
  for (const [ip, e] of seen) {
    const lastHit = e.hits[e.hits.length - 1] ?? 0;
    const lastCode = Math.max(0, ...e.codes.values());
    if (now - Math.max(lastHit, lastCode) >= CODE_WINDOW_MS) seen.delete(ip);
    if (seen.size <= MAX_TRACKED) break;
  }
}

function blocked(ip: string, code: string | null): boolean {
  const now = Date.now();
  const entry = seen.get(ip) ?? { codes: new Map<string, number>(), hits: [] };
  seen.set(ip, entry);

  entry.hits = entry.hits.filter((t) => now - t < FLOOD_WINDOW_MS);
  entry.hits.push(now);

  for (const [c, t] of entry.codes) {
    if (now - t >= CODE_WINDOW_MS) entry.codes.delete(c);
  }
  /* 이미 본 코드는 시각만 갱신한다 — 같은 병을 계속 여는 건 탐색이 아니다 */
  if (code) entry.codes.set(code, now);

  sweep(now);
  return entry.codes.size > MAX_CODES || entry.hits.length > MAX_HITS;
}

export default function proxy(req: NextRequest) {
  const code = bottleCode(req.nextUrl.pathname);
  if (!blocked(clientIp(req), code)) return NextResponse.next();

  /* 429 + Retry-After. 차단됐다는 사실 자체는 숨기지 않는다 —
     정상 사용자가 걸렸을 때 언제 다시 되는지 알 수 있어야 한다. */
  return new NextResponse("Too Many Requests", {
    status: 429,
    headers: {
      "Retry-After": String(Math.ceil(CODE_WINDOW_MS / 1000)),
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  /* /b 아래만. 정적 자산은 매처에서 빠져 카운터를 낭비하지 않는다. */
  matcher: ["/b/:path*"],
};
