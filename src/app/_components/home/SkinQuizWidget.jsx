"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/api/api";

export const SkinQuizWidget = () => {
  const { isBn, formatPrice } = useLanguage();
  const router = useRouter();

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({
    skinType: "",
    concern: "",
    finish: "",
  });
  const [recommendedRoutine, setRecommendedRoutine] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);

  const concerns = [
    { en: "Dryness & dehydration", bn: "শুষ্কতা ও পানির অভাব" },
    { en: "Dullness", bn: "ত্বকের মলিনতা" },
    { en: "Breakouts", bn: "ব্রণ ও পোর সমস্যা" },
    { en: "Frizz & breakage", bn: "চুলের রুক্ষতা ও ডগা ফাটা" },
    { en: "Fine lines", bn: "সূক্ষ্ম বলিরেখা" },
    { en: "Sensitive skin", bn: "সংবেদনশীল ত্বক" },
  ];

  const handleConcernClick = (concernEn) => {
    router.push(`/shop?concern=${encodeURIComponent(concernEn)}`);
  };

  const handleStartQuiz = () => {
    setQuizStep(1);
    setRecommendedRoutine([]);
    setIsQuizModalOpen(true);
  };

  const handleAnswer = async (field, val) => {
    const updated = { ...quizAnswers, [field]: val };
    setQuizAnswers(updated);
    if (quizStep < 3) {
      setQuizStep(quizStep + 1);
      return;
    }

    setQuizLoading(true);
    setQuizStep(4);
    try {
      const { items: products } = await api.getProducts({ limit: 48 });
      const matched = products.filter((p) =>
        p.concerns?.some((c) => c.toLowerCase().includes(updated.concern.toLowerCase().split(" ")[0]))
      );
      setRecommendedRoutine((matched.length >= 3 ? matched : products).slice(0, 3));
    } catch {
      setRecommendedRoutine([]);
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <>
      <section
        id="quiz"
        className="w-full bg-[#2A1220] text-white py-[44px] sm:py-[64px] lg:py-[94px]"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-[72px] items-center">
          {/* Left Column matching Main.dc.html line 173 */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-[24px]">
            <span
              className="eyebrow !text-[#F4A9C0] !text-[12px] sm:!text-[13px] font-bold tracking-[0.16em] uppercase"
              style={{
                fontFamily: isBn
                  ? "'Hind Siliguri', sans-serif"
                  : "'DM Sans', sans-serif",
              }}
            >
              {isBn ? "রুটিন ফাইন্ডার" : "Routine finder"}
            </span>

            <h2
              className="d text-[32px] sm:text-[44px] lg:text-[60px] mt-[-7px] leading-[1.05] text-white m-0 font-bold"
              style={{
                fontFamily: isBn
                  ? "'Anek Bangla', 'Hind Siliguri', sans-serif"
                  : "'Bricolage Grotesque', system-ui, sans-serif",
              }}
            >
              {isBn ? (
                <>
                  আপনার ত্বক আজ কী{" "}
                  <span style={{ color: "#F4A9C0" }}>বলছে?</span>
                </>
              ) : (
                <>
                  <div>
                    What's your skin{" "}
                    <span
                      className="s font-normal"
                      style={{
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontStyle: "italic",
                        color: "#F4A9C0",
                      }}
                    >
                      saying
                    </span>{" "}
                    today?
                  </div>
                </>
              )}
            </h2>

            <p
              className="text-[#E6D3DA] text-[15px] sm:text-[17px] leading-[1.6] max-w-[460px] m-0"
              style={{
                fontFamily: isBn
                  ? "'Hind Siliguri', sans-serif"
                  : "'DM Sans', sans-serif",
              }}
            >
              {isBn
                ? "আপনার ত্বকের সমস্যা নির্বাচন করুন বা ছোট কুইজটি দিন — আমরা আপনার জন্য ৩-ধাপের উপযোগী রুটিন তৈরি করে দেব।"
                : "Pick a concern or take the quiz — we'll build a three-step routine from products that suit you."}
            </p>

            <button
              onClick={handleStartQuiz}
              className="btn rose self-start cursor-pointer !h-[48px] sm:!h-[52px] !px-[24px] sm:!px-[28px] !text-[14px] sm:!text-[15px]"
              style={{
                fontFamily: isBn
                  ? "'Hind Siliguri', sans-serif"
                  : "'DM Sans', sans-serif",
              }}
            >
              {isBn ? "৬০-সেকেন্ডের কুইজ শুরু করুন" : "Take the 60-second quiz"}
            </button>
          </div>

          {/* Right Column: 6 Concern Chips matching Main.dc.html line 180 (gap: 14px) */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2.5 sm:gap-[14px]">
            {concerns.map((c) => (
              <button
                key={c.en}
                onClick={() => handleConcernClick(c.en)}
                className="chipd group text-left w-full cursor-pointer !h-[56px] sm:!h-[64px] lg:!h-[72px] !px-4 sm:!px-[24px] !text-[15px] sm:!text-[16px] lg:!text-[17px]"
                style={{
                  fontFamily: isBn
                    ? "'Hind Siliguri', sans-serif"
                    : "'DM Sans', sans-serif",
                }}
              >
                <span>{isBn ? c.bn : c.en}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Quiz Modal Overlay */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1F1219]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#1F1219] w-full max-w-[500px] rounded-[28px] p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setIsQuizModalOpen(false)}
              className="absolute right-5 top-5 w-9 h-9 rounded-full bg-[#FCEEF1] text-[#1F1219] flex items-center justify-center hover:bg-[#C8325F] hover:text-white transition-colors"
            >
              ✕
            </button>

            {quizStep === 1 && (
              <div className="flex flex-col gap-4">
                <span className="text-[#C8325F] text-[13px] font-bold uppercase tracking-wider">
                  Step 1 of 3
                </span>
                <h3 className="d text-[24px] font-bold text-[#1F1219] m-0">
                  What is your primary skin type?
                </h3>
                <div className="flex flex-col gap-2 mt-2">
                  {[
                    "Dry / Dehydrated",
                    "Oily / Acne-prone",
                    "Combination",
                    "Normal",
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleAnswer("skinType", type)}
                      className="p-3.5 rounded-[14px] border border-[#EADBE0] text-left hover:border-[#1F1219] hover:bg-[#FCEEF1] transition-all font-semibold"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 2 && (
              <div className="flex flex-col gap-4">
                <span className="text-[#C8325F] text-[13px] font-bold uppercase tracking-wider">
                  Step 2 of 3
                </span>
                <h3 className="d text-[24px] font-bold text-[#1F1219] m-0">
                  What is your main concern?
                </h3>
                <div className="flex flex-col gap-2 mt-2">
                  {[
                    "Dullness & uneven tone",
                    "Fine lines & texture",
                    "Breakouts & redness",
                    "Barrier repair",
                  ].map((c) => (
                    <button
                      key={c}
                      onClick={() => handleAnswer("concern", c)}
                      className="p-3.5 rounded-[14px] border border-[#EADBE0] text-left hover:border-[#1F1219] hover:bg-[#FCEEF1] transition-all font-semibold"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 3 && (
              <div className="flex flex-col gap-4">
                <span className="text-[#C8325F] text-[13px] font-bold uppercase tracking-wider">
                  Step 3 of 3
                </span>
                <h3 className="d text-[24px] font-bold text-[#1F1219] m-0">
                  Preferred finish?
                </h3>
                <div className="flex flex-col gap-2 mt-2">
                  {[
                    "Dewy & glowing",
                    "Natural matte",
                    "Weightless & light",
                  ].map((finish) => (
                    <button
                      key={finish}
                      onClick={() => handleAnswer("finish", finish)}
                      className="p-3.5 rounded-[14px] border border-[#EADBE0] text-left hover:border-[#1F1219] hover:bg-[#FCEEF1] transition-all font-semibold"
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 4 && (
              <div className="flex flex-col gap-4">
                <span className="text-[#C8325F] text-[13px] font-bold uppercase tracking-wider">
                  Your Custom 3-Step Routine
                </span>
                <h3 className="d text-[22px] font-bold text-[#1F1219] m-0">
                  Matched just for you
                </h3>
                <div className="flex flex-col gap-3 my-2">
                  {quizLoading ? (
                    <p className="text-[14px] text-[#6E5A63] m-0">Finding products for your routine...</p>
                  ) : recommendedRoutine.length === 0 ? (
                    <p className="text-[14px] text-[#6E5A63] m-0">
                      {isBn ? "এখনো কোনো পণ্য যোগ করা হয়নি।" : "No products yet — check back soon."}
                    </p>
                  ) : (
                    recommendedRoutine.map((p, idx) => (
                      <div
                        key={p.id || p._id || idx}
                        className="flex items-center gap-3 p-2.5 rounded-[16px] bg-[#FCEEF1]"
                      >
                        <span className="w-7 h-7 rounded-full bg-[#1F1219] text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[14px] truncate">
                            {p.name}
                          </div>
                          <div className="text-[12px] text-[#6E5A63]">
                            {p.category} · {formatPrice(p.price)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => {
                    setIsQuizModalOpen(false);
                    router.push("/shop");
                  }}
                  className="btn rose w-full mt-2"
                >
                  Shop This Routine
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
