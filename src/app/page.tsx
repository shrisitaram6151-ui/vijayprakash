import Link from "next/link";
import { db } from "@/db";
import { services as servicesTable, testimonials as tTable } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { ensureSeed } from "@/lib/seed";
import Navbar from "@/components/Navbar";
import FloatingContact from "@/components/FloatingContact";
import CallbackForm from "@/components/CallbackForm";
import { SITE, waLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSeed();
  const services = await db
    .select()
    .from(servicesTable)
    .orderBy(asc(servicesTable.sortOrder));
  const testimonials = await db
    .select()
    .from(tTable)
    .where(eq(tTable.approved, true))
    .orderBy(desc(tTable.createdAt))
    .limit(8);

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section
          className="relative overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(13,9,6,0.75), rgba(13,9,6,0.95)), url('/images/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
            <div className="text-center md:text-left">
              <span className="inline-block rounded-full gold-border bg-black/40 px-4 py-1 text-xs tracking-wide text-amber-200">
                🕉️ {SITE.trustName}
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold leading-tight gold-text sm:text-5xl lg:text-6xl">
                {SITE.tagline.split("—")[0]}
              </h1>
              <p className="mt-2 text-lg text-amber-100/80">
                जीवन में सही दिशा — अनुभवी ज्योतिषाचार्य से प्रामाणिक परामर्श
              </p>
              <div className="mt-6 flex flex-col gap-1">
                <p className="font-display text-2xl font-semibold text-amber-200">
                  {SITE.nameEn}
                </p>
                <p className="text-sm text-amber-100/60 tracking-wider">
                  {SITE.title.toUpperCase()}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
                <Link
                  href="/booking"
                  className="rounded-full gold-gradient px-8 py-4 font-bold text-[#3a2a05] shadow-xl shadow-amber-900/40 transition hover:scale-105"
                >
                  परामर्श बुक करें — ₹{SITE.baseFee}/-
                </Link>
                <Link
                  href="#contact"
                  className="rounded-full border border-amber-400/50 px-8 py-4 font-semibold text-amber-200 backdrop-blur-sm"
                >
                  संपर्क जानकारी
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative h-[400px] w-full max-w-[400px] md:h-[500px] md:max-w-[500px]">
                <img
                  src="/images/zodiac-wheel.png"
                  alt="zodiac"
                  className="absolute inset-0 h-full w-full animate-spin-slow opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="relative h-full w-full overflow-hidden rounded-3xl border-2 border-amber-500/30 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                    <img
                      src="/images/maharaj-ji.jpg"
                      alt={SITE.nameEn}
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0906] via-transparent to-transparent opacity-60" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-2xl bg-amber-900/90 p-4 shadow-xl shadow-black/50 backdrop-blur-md gold-border md:-right-8">
                  <div className="text-center">
                    <div className="text-xl">🏆</div>
                    <div className="font-display text-sm font-bold gold-text">
                      Gold Medalist
                    </div>
                    <div className="text-[10px] text-amber-200/60 uppercase tracking-tighter">
                      Vedic Vidvan
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="radial-glow relative py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold gold-text md:text-4xl">
                हमारी विशेषज्ञ सेवाएँ
              </h2>
              <p className="mt-2 text-amber-100/70">
                विधिपूर्वक ज्योतिष समाधान हेतु आज ही बुकिंग करें
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="card-dark group flex flex-col rounded-2xl p-8 transition hover:-translate-y-1 hover:border-amber-400/50"
                >
                  <div className="text-5xl">{s.icon}</div>
                  <h3 className="mt-6 font-display text-xl font-bold text-amber-200">
                    {s.titleHi}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-amber-100/70">
                    {s.description}
                  </p>
                  <div className="mt-8 flex items-center justify-between border-t border-amber-500/10 pt-6">
                    <div>
                      <span className="font-display text-2xl font-bold gold-text">
                        ₹{s.price}
                      </span>
                    </div>
                    <Link
                      href={`/booking?service=${s.slug}`}
                      className="rounded-full gold-gradient px-6 py-2.5 text-sm font-bold text-[#3a2a05]"
                    >
                      बुक करें
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST INFO / ABOUT */}
        <section
          id="about"
          className="border-y border-amber-500/10 bg-black/20 py-20"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 md:grid-cols-[1fr_1.5fr]">
            <div className="relative mx-auto">
              <div className="h-72 w-72 overflow-hidden rounded-full gold-border bg-gradient-to-br from-amber-900/40 to-black shadow-2xl animate-float">
                <img
                  src="/images/maharaj-ji.jpg"
                  alt={SITE.nameEn}
                  className="h-full w-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-500">
                संस्थान परिचय
              </span>
              <h2 className="mt-2 font-display text-4xl font-bold gold-text">
                {SITE.trustName}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-amber-100/90">
                महाराज जी (Shri {SITE.proprietor}) एक अनुभवी वैदिक ज्योतिषाचार्य
                हैं। अयोध्या धाम की पवित्र भूमि से वे सनातन धर्म और ज्योतिष के
                माध्यम से जन-कल्याण हेतु समर्पित हैं।
              </p>
              <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  { n: "15+", l: "वर्ष अनुभव" },
                  { n: "10k+", l: "संतुष्ट जातक" },
                  { n: "अयोध्या", l: "पवित्र स्थान" },
                  { n: "सटीक", l: "भविष्यवाणी" },
                ].map((x) => (
                  <div key={x.l} className="text-center">
                    <div className="font-display text-2xl font-bold gold-text">
                      {x.n}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-amber-100/50">
                      {x.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-bold gold-text">
                संपर्क विवरण
              </h2>
              <p className="mt-4 text-amber-100/70">
                परामर्श हेतु कृपया पहले बुकिंग सुनिश्चित करें। बुकिंग के बाद आपको
                परामर्श का समय और नंबर प्रदान किया जाएगा।
              </p>

              <div className="mt-10 space-y-6">
                <div className="card-dark flex items-center gap-5 rounded-2xl p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-full gold-gradient text-2xl">
                    📍
                  </span>
                  <div>
                    <div className="text-xs text-amber-100/50 uppercase tracking-wider">
                      Address
                    </div>
                    <div className="text-amber-100">{SITE.address}</div>
                  </div>
                </div>

                <div className="card-dark flex items-center gap-5 rounded-2xl p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-full gold-gradient text-2xl">
                    ☎️
                  </span>
                  <div>
                    <div className="text-xs text-amber-100/50 uppercase tracking-wider">
                      Helpline
                    </div>
                    <div className="text-xl font-bold text-amber-200">
                      {SITE.helpline}
                    </div>
                  </div>
                </div>

                <div className="card-dark flex items-start gap-5 rounded-2xl p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-green-600/20 text-2xl text-green-400">
                    ✅
                  </span>
                  <div>
                    <div className="text-sm font-bold text-amber-200">
                      परामर्श प्रक्रिया
                    </div>
                    <p className="mt-1 text-xs text-amber-100/60 leading-relaxed">
                      1. सेवा चुनें <br />
                      2. सुरक्षित भुगतान करें <br />
                      3. अपना समय सुनिश्चित करें <br />
                      4. महाराज जी द्वारा कॉल/WhatsApp पर परामर्श
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <CallbackForm />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-amber-500/10 bg-black/60 pt-16 pb-10">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="text-4xl">🕉️</div>
          <h3 className="mt-4 font-display text-2xl font-bold gold-text">
            {SITE.trustName}
          </h3>
          <p className="mt-1 text-sm text-amber-100/60 italic">
            Proprietor: {SITE.proprietor}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-amber-100/70">
            <a href="/#services" className="hover:text-amber-300">
              हमारी सेवाएँ
            </a>
            <Link href="/booking" className="hover:text-amber-300">
              परामर्श बुकिंग
            </Link>
            <a href="/#contact" className="hover:text-amber-300">
              संपर्क
            </a>
          </div>
          <div className="mt-12 space-y-2 text-xs text-amber-100/40">
            <p>{SITE.address}</p>
            <p>
              Helpline: {SITE.helpline} | Mob: {SITE.phone1}, {SITE.phone2}
            </p>
            <p className="mt-6">
              © {new Date().getFullYear()} {SITE.trustName}. All Rights
              Reserved.
            </p>
          </div>
        </div>
      </footer>
      <FloatingContact />
    </>
  );
}
