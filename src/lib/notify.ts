const CALLMEBOT_PHONE = process.env.CALLMEBOT_PHONE || "918303333309";
const CALLMEBOT_APIKEY = process.env.CALLMEBOT_APIKEY || "";

export async function sendWhatsAppNotification(message: string): Promise<boolean> {
  if (!CALLMEBOT_APIKEY) {
    console.warn("CallMeBot API key not configured");
    return false;
  }

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${encodeURIComponent(
      message
    )}&apikey=${CALLMEBOT_APIKEY}`;

    const res = await fetch(url, { method: "GET" });
    return res.ok;
  } catch (err) {
    console.error("WhatsApp notification failed:", err);
    return false;
  }
}

export function formatBookingNotification(booking: {
  name: string;
  phone: string;
  serviceTitle: string;
  amount: number;
  consultType: string;
  preferredDate?: string | null;
  preferredTime?: string | null;
  question?: string | null;
  orderId: string;
}): string {
  const lines = [
    "🕉️ *नई बुकिंग प्राप्त हुई!*",
    "",
    `👤 *नाम:* ${booking.name}`,
    `📞 *मोबाइल:* ${booking.phone}`,
    `🪔 *सेवा:* ${booking.serviceTitle}`,
    `💰 *राशि:* ₹${booking.amount}`,
    `📱 *माध्यम:* ${booking.consultType}`,
  ];

  if (booking.preferredDate || booking.preferredTime) {
    lines.push(
      `🗓️ *पसंदीदा समय:* ${booking.preferredDate || ""} ${
        booking.preferredTime || ""
      }`
    );
  }

  if (booking.question) {
    lines.push(`❓ *प्रश्न:* ${booking.question}`);
  }

  lines.push("");
  lines.push(`🔖 Order: ${booking.orderId}`);
  lines.push(`🔗 admin panel: vijayprakash.vercel.app/admin`);

  return lines.join("\n");
}

export function formatCallbackNotification(callback: {
  name: string;
  phone: string;
  message?: string | null;
}): string {
  const lines = [
    "🔔 *नया कॉल बैक अनुरोध!*",
    "",
    `👤 *नाम:* ${callback.name}`,
    `📞 *मोबाइल:* ${callback.phone}`,
  ];

  if (callback.message) {
    lines.push(`💬 *संदेश:* ${callback.message}`);
  }

  lines.push("");
  lines.push(`🔗 vijayprakash.vercel.app/admin`);

  return lines.join("\n");
}
