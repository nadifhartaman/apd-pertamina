export function isValidJWT(token) {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && now < payload.exp;
  } catch (e) {
    return false;
  }
}
