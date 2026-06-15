export const apiBaseUrl = "/api/v1";

export function actionCableUrl(token: string): string {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/cable?token=${token}`;
}
