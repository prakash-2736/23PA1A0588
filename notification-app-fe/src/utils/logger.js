const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

export async function Log(stack, level, pkg, message, token) {
  if (!token) return;

  try {
    await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });
  } catch (error) {
    console.error("Frontend log failed:", error.message);
  }
}
