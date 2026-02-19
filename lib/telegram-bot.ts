type SendMessageOptions = {
  disableWebPagePreview?: boolean;
};

type TelegramApiResult = {
  ok?: boolean;
  description?: string;
};

export async function sendTelegramMessage(
  botToken: string,
  chatId: number | string,
  text: string,
  options: SendMessageOptions = {},
): Promise<void> {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: options.disableWebPagePreview ?? true,
      }),
    },
  );

  const result = (await response.json()) as TelegramApiResult;

  if (!response.ok || !result.ok) {
    throw new Error(result.description ?? "Telegram API error");
  }
}
