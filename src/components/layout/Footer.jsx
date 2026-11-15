"use client";

import React from "react";
import Link from "@/components/common/Link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { useLanguage } from "@/context/LanguageContext";

export const Footer = () => {
  const { isBn } = useLanguage();
  const pathname = usePathname();

  // 1. Checkout Page Footer: Clean white distraction-free footer matching Desktop-Checkout.dc.html line 134
  if (pathname === "/checkout") {
    return (
      <footer className="mt-auto shrink-0 border-t border-[#F1E4E8] py-[24px] px-4 sm:px-8 lg:px-[56px] w-full bg-white">
        <div className="max-w-[1440px] mx-auto flex flex-wrap justify-center items-center gap-4 sm:gap-[28px] text-[14px] text-[#6E5A63]">
          <Link
            href="/terms"
            className="text-[#6E5A63] hover:text-[#1F1219] transition-colors no-underline"
            style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
          >
            {isBn ? "ডেলিভারি পলিসি" : "Shipping policy"}
          </Link>
          <Link
            href="/terms"
            className="text-[#6E5A63] hover:text-[#1F1219] transition-colors no-underline"
            style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
          >
            {isBn ? "রিটার্ন" : "Returns"}
          </Link>
          <Link
            href="/privacy"
            className="text-[#6E5A63] hover:text-[#1F1219] transition-colors no-underline"
            style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
          >
            {isBn ? "প্রাইভেসি পলিসি" : "Privacy Policy"}
          </Link>
          <Link
            href="/terms"
            className="text-[#6E5A63] hover:text-[#1F1219] transition-colors no-underline"
            style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
          >
            {isBn ? "শর্তাবলি" : "Terms & Conditions"}
          </Link>
          <Link
            href="/contact"
            className="text-[#6E5A63] hover:text-[#1F1219] transition-colors no-underline"
            style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
          >
            {isBn ? "যোগাযোগ" : "Contact"}
          </Link>
        </div>
      </footer>
    );
  }

  // 2. Minimal / Compact Dark Footer (Height ~103px):
  // Used on: /cart, /account, /privacy, /terms, /search, and 404 not-found
  // Matching: Desktop-Cart.dc.html, Desktop-Account.dc.html, Desktop-Privacy.dc.html, Desktop-Terms.dc.html, Desktop-Search.dc.html, Desktop-404.dc.html
  const megaPages = ["/", "/shop", "/about", "/contact"];
  const isMegaFooter =
    !pathname ||
    megaPages.includes(pathname) ||
    pathname.startsWith("/product/");
  const isMinimal = !isMegaFooter;

  if (isMinimal) {
    return (
      <footer className="mt-auto shrink-0 bg-[#2A1220] text-[#F5E9ED] py-[32px] sm:py-[40px] w-full">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] flex flex-col md:flex-row justify-between items-center gap-4 text-[14px] text-[#D9C3CC]">
          {/* Logo */}
          <Link
            href="/"
            className="no-underline transition-opacity hover:opacity-90 shrink-0"
            aria-label="ABeauty and Fashion home"
          >
            <span
              className="d text-[22px] sm:text-[24px] font-bold text-white tracking-tight"
              style={{
                fontFamily: isBn
                  ? "'Bricolage Grotesque', system-ui, sans-serif"
                  : "'Bricolage Grotesque', system-ui, sans-serif",
              }}
            >
              ABeauty{" "}
              <span
                className="s font-normal text-[#F4A9C0]"
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                &amp;
              </span>{" "}
              Fashion
            </span>
          </Link>

          {/* Horizontal Links */}
          <div
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-[28px] text-[14px]"
            style={{
              fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif",
            }}
          >
            <Link href="/terms" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
              {isBn ? "ডেলিভারি" : "Shipping"}
            </Link>
            <Link href="/terms" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
              {isBn ? "রিটার্ন" : "Returns"}
            </Link>
            <Link href="/contact" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
              {isBn ? "যোগাযোগ" : "Contact"}
            </Link>
            <Link href="/privacy" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
              {isBn ? "প্রাইভেসি পলিসি" : "Privacy Policy"}
            </Link>
            <Link href="/terms" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
              {isBn ? "শর্তাবলি" : "Terms & Conditions"}
            </Link>
          </div>

          {/* Copyright */}
          <span
            className="text-[13px] sm:text-[14px] text-[#D9C3CC] shrink-0 text-center md:text-right"
            style={{
              fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif",
            }}
          >
            {isBn
              ? "© ২০২৬ ABeauty & Fashion · সর্বস্বত্ব সংরক্ষিত"
              : "© 2026 ABeauty & Fashion"}
          </span>
        </div>
      </footer>
    );
  }

  // 3. Full Mega Footer:
  // Used on: Home (/), Shop (/shop), Product Details (/product/[id]), About (/about), Contact (/contact)
  // Matching: Desktop-Home-BN.dc.html lines 146-154 & Main.dc.html lines 261-280
  if (isBn) {
    return (
      <footer className="mt-auto shrink-0 bg-[#2A1220] text-[#F5E9ED] pt-[56px] sm:pt-[64px] pb-[32px] w-full">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px]">
          {/* Main 4-column grid matching Desktop-Home-BN.dc.html lines 147-152 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-[36px] lg:gap-[40px] pb-[44px] lg:pb-[48px] border-b border-white/[0.12]">
            {/* Column 1: Brand Info & Bangladesh Payment methods */}
            <div className="flex flex-col gap-[16px]">
              <Link
                href="/"
                className="no-underline transition-opacity hover:opacity-90 inline-block"
              >
                <span
                  style={{
                    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                  }}
                  className="font-bold text-[26px] sm:text-[28px] text-white tracking-tight"
                >
                  ABeauty{" "}
                  <span
                    className="s font-normal text-[#F4A9C0]"
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontStyle: "italic",
                    }}
                  >
                    &amp;
                  </span>{" "}
                  Fashion
                </span>
              </Link>
              <p
                className="text-[#E6D3DA] text-[15px] sm:text-[16px] leading-[1.7] max-w-[320px] m-0"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                সৌন্দর্যে স্মার্ট হোন। বাছাই করা পণ্য, সৎ গাইড।
              </p>
              <span
                className="text-[13px] sm:text-[14px] text-[#D9C3CC]"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                পেমেন্ট: বিকাশ · নগদ · কার্ড · ক্যাশ অন ডেলিভারি
              </span>
            </div>

            {/* Column 2: Shop */}
            <div className="flex flex-col gap-[12px]">
              <span
                className="font-bold text-white text-[16px]"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                শপ
              </span>
              <Link href="/shop?category=Skincare" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
                স্কিনকেয়ার
              </Link>
              <Link href="/shop?category=Makeup" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
                মেকআপ
              </Link>
              <Link href="/shop?category=Hair+Care" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
                হেয়ার কেয়ার
              </Link>
              <Link href="/shop?category=Beauty+Tools" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
                বিউটি টুলস
              </Link>
            </div>

            {/* Column 3: Help */}
            <div className="flex flex-col gap-[12px]">
              <span
                className="font-bold text-white text-[16px]"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                সহায়তা
              </span>
              <Link href="/account" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
                অর্ডার ট্র্যাক করুন
              </Link>
              <Link href="/terms" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
                ডেলিভারি ও রিটার্ন
              </Link>
              <Link href="/contact" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
                যোগাযোগ
              </Link>
            </div>

            {/* Column 4: Company */}
            <div className="flex flex-col gap-[12px]">
              <span
                className="font-bold text-white text-[16px]"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                প্রতিষ্ঠান
              </span>
              <Link href="/about" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
                আমাদের সম্পর্কে
              </Link>
              <Link href="/privacy" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
                প্রাইভেসি পলিসি
              </Link>
              <Link href="/terms" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline">
                শর্তাবলি
              </Link>
            </div>
          </div>

          {/* Bottom Bar matching Desktop-Home-BN.dc.html line 153 */}
          <div
            className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-[24px] sm:pt-[28px] text-[13px] sm:text-[14px] text-[#D9C3CC]"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            <span>© ২০২৬ ABeauty &amp; Fashion · সর্বস্বত্ব সংরক্ষিত</span>
            <span>ট্রেড লাইসেন্স: TRAD/DSCC/012948/2026</span>
          </div>
        </div>
      </footer>
    );
  }

  // English Full Mega Footer matching Main.dc.html lines 261-280
  return (
    <footer className="mt-auto shrink-0 bg-[#2A1220] text-[#F5E9ED] pt-[60px] sm:pt-[72px] pb-[32px] w-full">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px]">
        {/* Main 5-column grid matching Main.dc.html line 262 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-[36px] lg:gap-[40px] pb-[48px] lg:pb-[56px] border-b border-white/[0.12]">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-[18px]">
            <Logo dark={true} />
            <p
              className="text-[#E6D3DA] text-[14px] sm:text-[15px] leading-[1.6] max-w-[300px] m-0"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Be smart with beauty and fashion. Curated products, honest guides.
            </p>

            {/* Social Icons matching Main.dc.html line 266 */}
            <div className="flex items-center gap-[8px]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="icb text-white hover:bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] !w-[40px] !h-[40px] rounded-full inline-flex items-center justify-center"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                  <circle cx="12" cy="12" r="4"></circle>
                  <circle cx="17.5" cy="6.5" r=".8"></circle>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="icb text-white hover:bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] !w-[40px] !h-[40px] rounded-full inline-flex items-center justify-center"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"></path>
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="icb text-white hover:bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] !w-[40px] !h-[40px] rounded-full inline-flex items-center justify-center"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M14 3v11a3.5 3.5 0 1 1-3.5-3.5"></path>
                  <path d="M14 3c.5 2.5 2.5 4.5 5 5"></path>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="icb text-white hover:bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] !w-[40px] !h-[40px] rounded-full inline-flex items-center justify-center"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="5" width="20" height="14" rx="4"></rect>
                  <path d="m10 9 5 3-5 3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="flex flex-col gap-[12px]">
            <span
              className="font-bold text-white mb-[4px] sm:mb-[6px] text-[15px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Shop
            </span>
            <Link href="/shop?category=Skincare" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Skincare
            </Link>
            <Link href="/shop?category=Makeup" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Makeup
            </Link>
            <Link href="/shop?category=Hair+Care" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Hair Care
            </Link>
            <Link href="/shop?category=Personal+Care" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Personal Care
            </Link>
            <Link href="/shop?category=Beauty+Tools" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Beauty Tools
            </Link>
          </div>

          {/* Column 3: Help */}
          <div className="flex flex-col gap-[12px]">
            <span
              className="font-bold text-white mb-[4px] sm:mb-[6px] text-[15px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Help
            </span>
            <Link href="/account" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Track order
            </Link>
            <Link href="/terms" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Shipping
            </Link>
            <Link href="/terms" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Returns
            </Link>
            <Link href="/contact#faq" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              FAQ
            </Link>
            <Link href="/contact" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Contact
            </Link>
          </div>

          {/* Column 4: Journal */}
          <div className="flex flex-col gap-[12px]">
            <span
              className="font-bold text-white mb-[4px] sm:mb-[6px] text-[15px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Journal
            </span>
            <Link href="/#journal" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Beauty &amp; Fashion
            </Link>
            <Link href="/#journal" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Personal Care
            </Link>
            <Link href="/#journal" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Health &amp; Fitness
            </Link>
            <Link href="/#journal" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Style
            </Link>
            <Link href="/#journal" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Buying Guides
            </Link>
          </div>

          {/* Column 5: Company */}
          <div className="flex flex-col gap-[12px]">
            <span
              className="font-bold text-white mb-[4px] sm:mb-[6px] text-[15px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Company
            </span>
            <Link href="/about" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              About us
            </Link>
            <Link href="/about" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Affiliate program
            </Link>
            <Link href="/privacy" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="fl text-[#E6D3DA] hover:text-white transition-colors no-underline text-[14px] sm:text-[15px]">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>

        {/* Bottom Bar matching Main.dc.html line 278 */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-[24px] sm:pt-[28px] text-[13px] sm:text-[14px] text-[#D9C3CC]">
          <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 ABeauty &amp; Fashion. All rights reserved.
          </span>
          <div className="flex items-center gap-[8px]">
            <span className="h-[28px] sm:h-[30px] px-[10px] sm:px-[12px] rounded-[6px] bg-white/10 flex items-center text-[11px] sm:text-[12px] font-bold text-white tracking-wider">
              VISA
            </span>
            <span className="h-[28px] sm:h-[30px] px-[10px] sm:px-[12px] rounded-[6px] bg-white/10 flex items-center text-[11px] sm:text-[12px] font-bold text-white tracking-wider">
              Mastercard
            </span>
            <span className="h-[28px] sm:h-[30px] px-[10px] sm:px-[12px] rounded-[6px] bg-white/10 flex items-center text-[11px] sm:text-[12px] font-bold text-white tracking-wider">
              PayPal
            </span>
            <span className="h-[28px] sm:h-[30px] px-[10px] sm:px-[12px] rounded-[6px] bg-white/10 flex items-center text-[11px] sm:text-[12px] font-bold text-white tracking-wider">
              Apple Pay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
