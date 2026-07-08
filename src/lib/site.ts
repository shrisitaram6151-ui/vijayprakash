export const SITE = {
  trustName: "Shri Sitaram Seva Trust",
  proprietor: "Vijay Prakash Tiwari",
  name: "विजय प्रकाश तिवारी",
  nameEn: "Vijay Prakash Tiwari",
  title: "ज्योतिषाचार्य एवं आध्यात्मिक मार्गदर्शक",
  tagline: "ज्योतिष मार्गदर्शन — जीवन में सही दिशा",
  address: "Luvkushnagar, Ramghat-Ayodhya Dhaam",
  phone1: "8303333309",
  phone2: "9918310009",
  helpline: "05278-424511",
  whatsapp: "8303333309",
  baseFee: 299,
};

export function waLink(text = "नमस्ते महाराज जी, मैंने परामर्श बुक किया है।") {
  return `https://wa.me/918303333309?text=${encodeURIComponent(text)}`;
}

export function telLink(num = "8303333309") {
  const clean = num.replace(/\D/g, "");
  return `tel:+91${clean}`;
}
