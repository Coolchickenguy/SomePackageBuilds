import path from "path";
import { fileURLToPath } from "url";
export function pathPatch(importMeta) {
  globalThis.__filename = fileURLToPath(importMeta.url);
  globalThis.__dirname = path.dirname(__filename);
}
export default function (importMeta) {
  pathPatch(importMeta);
}
