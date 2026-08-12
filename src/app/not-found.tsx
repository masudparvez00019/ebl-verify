import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 Page',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans select-none">
      {/* Top Section with Light Gray Background matching EBL section */}
      <section className="bg-[#f8f9fa] pt-12 pb-20 sm:pt-16 sm:pb-24 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Top Header Logo */}
          <div className="text-center mb-14 sm:mb-20">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ebl-logo-left.png"
                alt="Eastern Bank PLC. Main logo"
                className="h-12 sm:h-14 w-auto object-contain mx-auto"
              />
            </Link>
          </div>

          {/* 404 Header text with empty rectangle outline box (7.0rem / 112px) */}
          <div className="timeline text-center mb-14 sm:mb-20">
            <h1 className="flex items-center justify-center gap-3 sm:gap-4 text-[70px] sm:text-[112px] font-semibold text-[#333333] leading-none tracking-normal font-sans">
              {/* Empty Box Outline */}
              <div className="w-10 h-14 sm:w-[56px] sm:h-[72px] border-[3px] border-[#333333] rounded-[2px] flex-shrink-0" />
              <span>404!</span>
            </h1>
          </div>


          {/* Timeline Info Card - Exact CSS from EBL Inspector: 
              background: #ffd00a; padding: 30px; border-radius: 50px; border: 5px solid #ffd00a; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); */}
          <div className="timelineinfo bg-[#ffd00a] p-[30px] rounded-[50px] border-[5px] border-[#ffd00a] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-full max-w-[730px] text-center">
            <h2 className="text-[28.8px] font-semibold text-[#555555] mt-0 mb-[20px] leading-[1.42857] font-sans text-center">
              Oops! Page Not Found
            </h2>
            <p className="text-[15px] text-[#555555] mb-[20px] font-normal leading-[1.4] text-center">
              The page you were looking for could not be found.
            </p>

            {/* Go Home Border Button */}
            <Link
              id="displayText"
              href="/"
              title="Go Home"
              style={{ background: 'white' }}
              className="inline-block bg-white text-[#005bab] border border-[#005bab] rounded-full px-8 py-2 text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all"
            >
              Go Home
            </Link>
          </div>


        </div>
      </section>

      {/* Bottom Section - Pure White Background */}
      <div className="flex-1 bg-white" />
    </div>
  );
}






