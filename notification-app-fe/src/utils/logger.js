import { Log as BaseLog } from "../../../logging-middleware/index.js";

const FRONTEND_TOKEN = import.meta.env.VITE_AFFORD_TOKEN || "";

export async function Log(stack, level, pkg, message) {
  return BaseLog(stack, level, pkg, message, FRONTEND_TOKEN);
}
