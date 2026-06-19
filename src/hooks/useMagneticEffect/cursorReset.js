export const CURSOR_RESET_EVENT = "portfolio:cursor-reset";

export function requestCursorReset() {
  window.dispatchEvent(new CustomEvent(CURSOR_RESET_EVENT));
}