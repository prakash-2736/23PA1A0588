const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

async function Log(stack, level, pkg, message, token) {
  try {
    const response = await fetch(LOG_API_URL, {
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

    if (!response.ok) {
      throw new Error(`Logging failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Remote logging failed:", error.message);
    return null;
  }
}

export { Log };
