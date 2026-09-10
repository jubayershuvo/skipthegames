export async function sendTelegramMessage(
  chatId: string | number,
  message: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.TELEGRAM_API_URL}/send-message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: String(chatId),
          message,
        }),
      }
    );

    const data = await response.json();
    console.log("Telegram response:", data);
    return response.ok && data.success === true;
  } catch (error) {
    console.error("Telegram error:", error);
    return false;
  }
}
