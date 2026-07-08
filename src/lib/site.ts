export const SITE = {
  trustName: "श्री सीताराम सेवा ट्रस्ट",
  proprietor: "विजय प्रकाश तिवारी",
  name: "विजय प्रकाश तिवारी",
  nameEn: "Vijay Prakash Tiwari",
  title: "ज्योतिषाचार्य एवं आध्यात्मिक मार्गदर्शक",
  tagline: "ज्योतिष मार्गदर्शन — जीवन में सही दिशा",
  address: "लवकुशनगर, रामघाट-अयोध्या धाम",
  phone: "9918310009",
  phone1: "9918310009",
  phone2: "8303333309",
  helpline: "05278-424511",
  whatsapp: "8303333309",
  baseFee: 299,
};

export function waLink(text = "नमस्ते महाराज जी, मुझे ज्योतिष परामर्श चाहिए।") {
  return `https://wa.me/91${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    text
  )}`;
}

export function telLink(phone?: string) {
  const num = (phone || SITE.phone).replace(/\D/g, "");
  return `tel:+91${num}`;
}

export function telLink2() {
  return `tel:+91${SITE.phone2.replace(/\D/g, "")}`;
}
