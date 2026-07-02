import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Kamu adalah WebCraft AI, asisten virtual dari WebCraft — agensi pembuatan website profesional di Indonesia.

Tugas kamu:
- Menjawab pertanyaan seputar layanan, harga, proses, dan teknologi yang digunakan WebCraft
- Bahasa: Indonesia yang ramah, profesional, dan ringkas
- Jangan jawab pertanyaan di luar konteks WebCraft / web development
- Selalu arahkan ke WhatsApp untuk pemesanan

Informasi WebCraft:
- Layanan: Website Company Profile, E-Commerce / Toko Online, Landing Page, Web App Custom
- Harga mulai dari Rp 1.5 juta (paket Starter) hingga Rp 8 juta+ (paket Enterprise)
- Estimasi pengerjaan: 5–20 hari kerja tergantung kompleksitas
- Revisi: 2–5 kali (tergantung paket)
- Teknologi: Next.js, React, Tailwind CSS, Node.js, PostgreSQL, Prisma
- Garansi: support 30 hari setelah website live
- Kontak: WhatsApp 089501113573`;

// Rule-based fallback responses
const RULES: Array<{ keywords: string[]; reply: string }> = [
  {
    keywords: ["harga", "biaya", "berapa", "cost", "tarif", "bayar"],
    reply: "Harga paket WebCraft mulai dari:\n\n🟢 **Starter** — Rp 1,5 jt (Company Profile sederhana, 5 hari kerja)\n🔵 **Professional** — Rp 3,5 jt (E-Commerce / Landing Page, 10 hari kerja)\n🟣 **Enterprise** — Rp 8 jt+ (Web App Custom, 20 hari kerja)\n\nSemua paket sudah termasuk domain + hosting 1 tahun! Mau lihat detail fiturnya?",
  },
  {
    keywords: ["lama", "waktu", "hari", "durasi", "selesai", "pengerjaan"],
    reply: "Estimasi waktu pengerjaan kami:\n\n⚡ **Company Profile** — 5–7 hari kerja\n📦 **E-Commerce** — 10–14 hari kerja\n🚀 **Web App Custom** — 15–25 hari kerja\n\nWaktu bisa lebih cepat jika brief proyek sudah lengkap dari awal!",
  },
  {
    keywords: ["revisi", "ubah", "edit", "perubahan"],
    reply: "Kebijakan revisi WebCraft:\n\n✅ Paket Starter — **2x revisi** gratis\n✅ Paket Professional — **3x revisi** gratis\n✅ Paket Enterprise — **5x revisi** gratis\n\nRevisi tambahan di luar paket bisa didiskusikan sesuai kebutuhan.",
  },
  {
    keywords: ["teknologi", "tech", "framework", "stack", "pakai", "menggunakan"],
    reply: "Teknologi yang kami gunakan:\n\n⚛️ **Frontend**: Next.js, React, Tailwind CSS\n🟢 **Backend**: Node.js, Next.js API Routes\n🗄️ **Database**: PostgreSQL, SQLite, Prisma ORM\n☁️ **Deploy**: Vercel, VPS, atau hosting pilihan klien\n\nSemua website kami dibangun dengan performa tinggi dan SEO-ready!",
  },
  {
    keywords: ["garansi", "support", "after", "setelah", "maintenance"],
    reply: "Kami memberikan **garansi support 30 hari** setelah website live — gratis!\n\nMeliputi:\n🛡️ Bug fix & perbaikan error\n📞 Konsultasi teknis via WhatsApp\n🔧 Pembaruan minor konten\n\nSetelah 30 hari, tersedia paket maintenance bulanan.",
  },
  {
    keywords: ["portofolio", "contoh", "hasil", "karya", "proyek"],
    reply: "Kami sudah menyelesaikan **120+ proyek** untuk berbagai klien! 🎉\n\nBeberapa kategori proyek kami:\n🛒 Toko Online / E-Commerce\n🏢 Website Company Profile\n📱 Landing Page Konversi Tinggi\n⚙️ Web App Custom\n\nLihat portofolio lengkap di bagian **Portfolio** halaman ini, atau hubungi kami di WhatsApp untuk lihat contoh spesifik sesuai kebutuhan Anda!",
  },
  {
    keywords: ["order", "pesan", "mulai", "hubungi", "konsultasi", "whatsapp"],
    reply: "Siap memulai proyek website Anda! 🚀\n\nLangkah pemesanan:\n1️⃣ Chat via **WhatsApp** untuk konsultasi gratis\n2️⃣ Diskusi kebutuhan & pilih paket\n3️⃣ Tanda tangan brief + DP 50%\n4️⃣ Proses pengerjaan dimulai!\n\nKlik tombol **\"Pesan via WA\"** di bawah untuk langsung chat dengan tim kami.",
  },
];

function getRuleBasedReply(userMessage: string): string | null {
  const lower = userMessage.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.reply;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages?.findLast((m: any) => m.role === "user")?.content || "";

    // Try OpenAI or OpenCode Zen API if key exists
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (OPENAI_KEY) {
      try {
        const formattedMessages = messages.map((m: any) => ({
          role: m.role === "bot" ? "assistant" : m.role,
          content: m.content
        }));

        const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
        const model = process.env.CHAT_MODEL || (baseURL.includes("opencode.ai") ? "mimo-v2.5-free" : "gpt-4o-mini");

        const res = await fetch(`${baseURL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_KEY}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...formattedMessages
            ],
            max_tokens: 1024,
            temperature: 0.7
          })
        });
        const data = await res.json();
        let reply = data?.choices?.[0]?.message?.content;

        // Fallback to other free model if needed
        if (!reply && baseURL.includes("opencode.ai")) {
          const fallbackRes = await fetch(`${baseURL}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENAI_KEY}`
            },
            body: JSON.stringify({
              model: "nemotron-3-ultra-free",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...formattedMessages
              ],
              max_tokens: 1024,
              temperature: 0.7
            })
          });
          const fallbackData = await fallbackRes.json();
          reply = fallbackData?.choices?.[0]?.message?.content;
        }

        if (reply) return NextResponse.json({ reply });
      } catch (err) {
        console.error("OpenAI/OpenCode Error:", err);
      }
    }

    // Try Gemini API if key exists
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (GEMINI_KEY) {
      try {
        const geminiMessages = messages.map((m: any) => ({
          role: m.role === "assistant" || m.role === "bot" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: geminiMessages,
              generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
            }),
          }
        );
        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return NextResponse.json({ reply });
      } catch {
        // fallthrough to rule-based
      }
    }

    // Rule-based fallback
    const ruleReply = getRuleBasedReply(lastUserMessage);
    if (ruleReply) {
      return NextResponse.json({ reply: ruleReply });
    }

    // Generic fallback
    return NextResponse.json({
      reply:
        "Terima kasih pertanyaannya! 😊 Untuk informasi lebih detail, tim kami siap membantu Anda langsung via WhatsApp. Klik **\"Pesan via WA\"** di bawah untuk konsultasi gratis!",
    });
  } catch {
    return NextResponse.json(
      { reply: "Maaf, terjadi kesalahan. Silakan hubungi kami via WhatsApp." },
      { status: 500 }
    );
  }
}
