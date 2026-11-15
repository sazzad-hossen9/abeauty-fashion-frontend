"use client";

import React, { useState } from "react";
import Link from "@/components/common/Link";
import { useModal } from "@/context/ModalContext";
import { useLanguage } from "@/context/LanguageContext";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const { setNewsletterModalOpen } = useModal();
  const { isBn } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setNewsletterModalOpen(true);
      setEmail("");
    }
  };

  return (
    <section className="w-full py-[40px] sm:py-[64px] lg:pb-[84px] lg:pt-[86px]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px]">
        {/* Card with background #FCEEF1, radius 36px, padding 64px 72px matching Main.dc.html line 245 */}
        <div className="bg-[#FCEEF1] rounded-[26px] sm:rounded-[36px] p-6 sm:p-10 lg:p-[64px_72px] grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-[48px] items-center">
          {/* Left Side matching Main.dc.html line 246 */}
          <div className="flex flex-col gap-3 sm:gap-[14px]">
            <h2
              className="d text-[28px] sm:text-[40px] lg:text-[52px] leading-[1.05] text-[#1F1219] m-0 font-bold"
              style={{
                fontFamily: isBn
                  ? "'Anek Bangla', 'Hind Siliguri', sans-serif"
                  : "'Bricolage Grotesque', system-ui, sans-serif",
              }}
            >
              {isBn ? (
                <>
                  যুক্ত হোন{" "}
                  <span style={{ color: "#C8325F" }}>গ্লো লিস্টে</span>
                </>
              ) : (
                <>
                  <div>
                    {" "}
                    Join the{" "}
                    <span
                      className="s font-normal"
                      style={{
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontStyle: "italic",
                        color: "#C8325F",
                      }}
                    >
                      Glow List
                    </span>
                  </div>
                </>
              )}
            </h2>
            <p
              className="mut text-[14px] sm:text-[16px] lg:text-[17px] leading-[1.55] m-0 text-[#6E5A63]"
              style={{
                fontFamily: isBn
                  ? "'Hind Siliguri', sans-serif"
                  : "'DM Sans', sans-serif",
              }}
            >
              {isBn
                ? "নতুন কালেকশনের দ্রুত অ্যাক্সেস, জার্নাল থেকে রুটিন টিপস এবং মেম্বার-অনলি স্পেশাল অফার। স্প্যামমুক্ত, যেকোনো সময় আনসাবস্ক্রাইব করতে পারবেন।"
                : "Early access to drops, routine tips from the journal and members-only offers. No spam, unsubscribe anytime."}
            </p>
          </div>

          {/* Right Side Form matching Main.dc.html line 250 */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]">
            <label
              htmlFor="newsletter-email"
              className="text-[13px] font-semibold text-[#1F1219]"
              style={{
                fontFamily: isBn
                  ? "'Hind Siliguri', sans-serif"
                  : "'DM Sans', sans-serif",
              }}
            >
              {isBn ? "ইমেইল অ্যাড্রেস" : "Email address"}
            </label>

            {/* Input Capsule with padding 6px, border #EADBE0 matching Main.dc.html line 252 */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-[10px] bg-white rounded-[20px] sm:rounded-full p-2 sm:p-[6px] border border-[#EADBE0] shadow-xs">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isBn ? "আপনার ইমেইল দিন..." : "you@example.com"}
                required
                className="flex-1 border-0 outline-hidden px-3 sm:px-[18px] py-2 sm:py-0 text-[15px] sm:text-[16px] bg-transparent text-[#1F1219] placeholder:text-[#6E5A63]/60 min-w-0"
                style={{
                  fontFamily: isBn
                    ? "'Hind Siliguri', sans-serif"
                    : "'DM Sans', sans-serif",
                }}
              />
              <button
                type="submit"
                className="btn shrink-0 cursor-pointer !h-[44px] sm:!h-[52px] !px-[20px] sm:!px-[28px] !text-[14px] sm:!text-[15px]"
                style={{
                  fontFamily: isBn
                    ? "'Hind Siliguri', sans-serif"
                    : "'DM Sans', sans-serif",
                }}
              >
                {isBn ? "সাবস্ক্রাইব" : "Subscribe"}
              </button>
            </div>

            <span
              className="mut text-[12px] sm:text-[13px] text-[#6E5A63]"
              style={{
                fontFamily: isBn
                  ? "'Hind Siliguri', sans-serif"
                  : "'DM Sans', sans-serif",
              }}
            >
              {isBn ? (
                <>
                  সাবস্ক্রাইব করার মাধ্যমে আপনি আমাদের{" "}
                  <Link to="/privacy" className="underline text-[#1F1219]">
                    গোপনীয়তা নীতি
                  </Link>{" "}
                  মেনে নিচ্ছেন।
                </>
              ) : (
                <>
                  By subscribing you agree to our{" "}
                  <Link to="/privacy" className="underline text-[#1F1219]">
                    Privacy Policy
                  </Link>
                  .
                </>
              )}
            </span>
          </form>
        </div>
      </div>
    </section>
  );
};
