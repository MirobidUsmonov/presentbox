
export async function sendTelegramMessage(text: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN || "8165455955:AAEwZWwJGfJiOfc8Zxx-R1oQQasTonhIdfY";
    const chatId = process.env.TELEGRAM_CHAT_ID || "1209738128";

    if (!token || !chatId) {
        console.warn("Telegram credentials not found. Message not sent.");
        return;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            const data = await response.json();
            console.error("Failed to send Telegram message:", data);
        }
    } catch (error) {
        console.error("Error sending Telegram message:", error);
    }
}
