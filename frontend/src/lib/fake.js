export const fakeToken = [
  btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })), // header
  btoa(
    JSON.stringify({
      id: 1,
      email: "test@pertamina.go.id",
      roles: [{ name: "admin" }],
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // expire in 1 hour
    })
  ),
  "fakesignature123" // just a dummy string
].join(".");
