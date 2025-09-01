// lib/auditHash.ts
import crypto from "crypto";

export function recordHash(prevHash: string | null, payload: object) {
  const data = (prevHash ?? "") + JSON.stringify(payload, Object.keys(payload).sort());
  return crypto.createHash("sha256").update(data).digest("hex");
}
