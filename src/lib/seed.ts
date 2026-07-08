import { db } from "@/db";
import { services, testimonials } from "@/db/schema";
import { sql } from "drizzle-orm";

export const DEFAULT_SERVICES = [
  {
    slug: "kundli-vishleshan",
    titleHi: "कुंडली विश्लेषण",
    titleEn: "Kundli Analysis",
    description:
      "आपकी जन्म कुंडली का सूक्ष्म विश्लेषण — ग्रह, दशा, योग एवं भविष्य की सम्पूर्ण जानकारी।",
    icon: "🪔",
    price: 299,
    durationMin: 25,
    sortOrder: 1,
  },
  {
    slug: "vivah-paramarsh",
    titleHi: "विवाह परामर्श",
    titleEn: "Marriage Consultation",
    description:
      "गुण मिलान, मंगल दोष, विवाह में विलंब एवं दाम्पत्य जीवन के लिए सटीक ज्योतिषीय मार्गदर्शन।",
    icon: "💍",
    price: 399,
    durationMin: 30,
    sortOrder: 2,
  },
  {
    slug: "career-margdarshan",
    titleHi: "करियर मार्गदर्शन",
    titleEn: "Career Guidance",
    description:
      "शिक्षा, नौकरी, व्यापार एवं आर्थिक उन्नति हेतु ग्रहों के अनुसार सही दिशा का निर्धारण।",
    icon: "📈",
    price: 299,
    durationMin: 25,
    sortOrder: 3,
  },
  {
    slug: "grah-dosh-nivaran",
    titleHi: "ग्रह दोष निवारण",
    titleEn: "Graha Dosh Nivaran",
    description:
      "काल सर्प, पितृ, शनि एवं अन्य ग्रह दोषों की पहचान और प्रभावी उपाय एवं शांति विधि।",
    icon: "🪐",
    price: 499,
    durationMin: 30,
    sortOrder: 4,
  },
  {
    slug: "vastu-paramarsh",
    titleHi: "वास्तु परामर्श",
    titleEn: "Vastu Consultation",
    description:
      "घर, दुकान एवं कार्यस्थल में वास्तु दोष का निवारण और सुख-समृद्धि हेतु उपाय।",
    icon: "🏠",
    price: 599,
    durationMin: 35,
    sortOrder: 5,
  },
  {
    slug: "jeevan-margdarshan",
    titleHi: "जीवन मार्गदर्शन",
    titleEn: "Life Guidance",
    description:
      "जीवन की हर उलझन का आध्यात्मिक एवं ज्योतिषीय समाधान — सही निर्णय एवं मानसिक शांति।",
    icon: "🧘",
    price: 299,
    durationMin: 25,
    sortOrder: 6,
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    name: "अनुज शर्मा",
    location: "लखनऊ",
    message:
      "महाराज जी की भविष्यवाणी बिल्कुल सटीक निकली। करियर को लेकर जो मार्गदर्शन मिला उससे मेरी नौकरी लग गई।",
    rating: 5,
  },
  {
    name: "प्रिया गुप्ता",
    location: "कानपुर",
    message:
      "विवाह में हो रही देरी का कारण और उपाय दोनों बताए। कुछ ही महीनों में शुभ रिश्ता आ गया। धन्यवाद महाराज जी।",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    location: "Delhi",
    message:
      "Very accurate kundli analysis and genuine remedies. Call par pura time diya aur har sawal ka jawab mila.",
    rating: 5,
  },
  {
    name: "सीमा त्रिपाठी",
    location: "प्रयागराज",
    message:
      "ग्रह दोष निवारण के उपाय से घर का माहौल शांत हो गया। बहुत सरल और सच्चे ज्योतिषाचार्य हैं।",
    rating: 5,
  },
];

export async function ensureSeed() {
  const existing = await db.execute(sql`select count(*)::int as c from services`);
  const count = (existing.rows[0] as { c: number }).c;
  if (count === 0) {
    await db.insert(services).values(DEFAULT_SERVICES);
    await db.insert(testimonials).values(DEFAULT_TESTIMONIALS);
  }
}
