'use client';

import React, { useEffect, useState, useCallback, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, X, Laptop } from 'lucide-react';
import DynamicCaptcha from '@/components/verification/captcha';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function EblVerifyPortalPage({ searchParams }: PageProps) {
  const resolvedParams = use(searchParams);
  
  // Extract qr parameter
  const qrParamRaw = resolvedParams?.qr || resolvedParams?.q || '';
  const qrHash = Array.isArray(qrParamRaw) ? qrParamRaw[0] : qrParamRaw;

  // View States: 'CAPTCHA' | 'VERIFIED' | 'FAILED' | 'MANUAL_INPUT'
  const [viewState, setViewState] = useState<'CAPTCHA' | 'VERIFIED' | 'FAILED' | 'MANUAL_INPUT'>('CAPTCHA');
  
  // Captcha state
  const [expectedCaptcha, setExpectedCaptcha] = useState<string>('');
  const [captchaInput, setCaptchaInput] = useState<string>('');
  const [captchaError, setCaptchaError] = useState<string>('');

  // Manual QR input state
  const [manualInput, setManualInput] = useState<string>('');
  const [manualError, setManualError] = useState<string>('');

  // Loaded statement details
  const [statementData, setStatementData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCaptchaCodeChange = useCallback((code: string) => {
    setExpectedCaptcha(code);
  }, []);

  useEffect(() => {
    document.title = 'Document Verification | EBL Self Service';
    if (!qrHash || !qrHash.trim()) {
      setViewState('MANUAL_INPUT');
    } else {
      setViewState('CAPTCHA');
    }
  }, [qrHash]);


  // Handle Captcha Form Submit
  const handleCaptchaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCaptchaError('');

    if (!captchaInput || captchaInput.trim().toUpperCase() !== expectedCaptcha.toUpperCase()) {
      setCaptchaError('CAPTCHA session is missing or expired. Please try again.');
      return;
    }


    // Captcha Passed! Fetch statement details from backend API
    setIsLoading(true);
    try {
      const res = await fetch(`/api/verify?qr=${encodeURIComponent(qrHash || '')}`);
      const data = await res.json();

      if (res.ok && data.statement) {
        setStatementData(data.statement);
        setViewState('VERIFIED');
      } else {
        setViewState('FAILED');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setViewState('FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Manual Input Submit
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');

    if (!manualInput || !manualInput.trim()) {
      setManualError('Please enter a QR value or verification URL.');
      return;
    }

    let extractedHash = manualInput.trim();
    if (extractedHash.includes('qr=')) {
      extractedHash = extractedHash.split('qr=')[1]?.split('&')[0] || extractedHash;
    } else if (extractedHash.includes('q=')) {
      extractedHash = extractedHash.split('q=')[1]?.split('&')[0] || extractedHash;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/verify?qr=${encodeURIComponent(extractedHash)}`);
      const data = await res.json();

      if (res.ok && data.statement) {
        setStatementData(data.statement);
        setViewState('VERIFIED');
      } else {
        setViewState('FAILED');
      }
    } catch (err) {
      console.error('Manual verification error:', err);
      setViewState('FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date string to match Image 2 format: "10-AUG-2026 07:28 PM"
  const formatIssueDate = (dateStr?: string | Date) => {
    const d = dateStr ? new Date(dateStr) : new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const hoursStr = String(hours).padStart(2, '0');

    return `${day}-${month}-${year} ${hoursStr}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-[#222222] flex flex-col font-sans select-none">
      
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-[#e0e0e0] h-[68px] flex items-center justify-between px-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        {/* Left logo: EBL main logo */}
        <div className="inline-block">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ebl-logo-left.png" alt="Eastern Bank PLC" className="h-[48px] w-auto block object-contain" />
          </Link>
        </div>
        {/* Right logo: EBL Self Service logo */}
        <div className="inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ebl-logo-right.png" alt="EBL Self Service" className="h-[57px] w-auto block object-contain" />
        </div>
      </div>
      <div className="h-[4px] bg-[#F5C518]"></div>

      {/* ── Body ── */}
      <div className="flex-1 flex items-start justify-center py-[48px] px-[16px] pb-[60px]">
        <div className="w-full max-w-[560px]">

          {/* State 1: Human Verification Card (Production EBL Markup) */}
          {viewState === 'CAPTCHA' && (
            <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] overflow-hidden p-[40px_40px_36px]">
              <h1 className="text-[1.5rem] font-bold text-[#111111] mb-2 text-center">Human Verification</h1>
              <p className="text-[.88rem] text-[#666666] mb-[28px] leading-[1.5] text-left">
                Enter the characters shown below before verifying document information.
              </p>

              {captchaError && (
                <div className="bg-[#fdecea] text-[#c0392b] rounded-[8px] p-[12px_16px] text-[.85rem] mb-[20px] text-left font-medium">
                  {captchaError}
                </div>
              )}

              <form onSubmit={handleCaptchaSubmit} className="text-center">
                {/* Dynamic Captcha Component */}
                <DynamicCaptcha onCodeChange={handleCaptchaCodeChange} />

                {/* Captcha Input */}
                <input
                  type="text"
                  placeholder="ENTER CAPTCHA"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full border-[1.5px] border-[#dddddd] rounded-[8px] p-[14px_16px] mb-[16px] text-[1rem] text-center tracking-[4px] uppercase outline-none bg-[#fafafa] focus:border-[#003876] focus:bg-white transition-colors"
                  required
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full p-[14px] border-none rounded-[8px] bg-[#F5C518] hover:bg-[#e6b800] text-[#111111] text-[.95rem] font-bold cursor-pointer transition-colors"
                >
                  {isLoading ? 'Verifying...' : 'Verify Document'}
                </button>
              </form>
            </div>
          )}

          {/* State 2: Document Verified Details Card (Production EBL Markup) */}
          {viewState === 'VERIFIED' && statementData && (
            <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] overflow-hidden p-[40px_40px_36px]">
              {/* Status wrap */}
              <div className="text-center pt-[8px] pb-[24px]">
                <div className="w-[80px] h-[80px] rounded-full bg-[#e6f9ef] text-[#1a8a4a] flex items-center justify-center mx-auto mb-[18px]">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h1 className="text-[1.35rem] font-bold text-[#1a8a4a] mb-[6px]">Document Verified</h1>
                <p className="text-[.84rem] text-[#888888] mb-[28px]">Verified Authentic by Eastern Bank PLC.</p>
              </div>

              <hr className="border-t border-[#eeeeee] -mx-[40px]" />

              <div className="pt-[4px]">
                <div className="flex items-center py-[13px] border-b border-[#f2f2f2]">
                  <div className="w-[44%] shrink-0 text-[.78rem] text-[#999999] uppercase tracking-[.5px] font-semibold text-left">Customer Name</div>
                  <div className="flex-1 text-[.9rem] text-[#222222] font-medium text-left">{statementData.customerName || 'ZAKIR HOSSAIN'}</div>
                </div>
                <div className="flex items-center py-[13px] border-b border-[#f2f2f2]">
                  <div className="w-[44%] shrink-0 text-[.78rem] text-[#999999] uppercase tracking-[.5px] font-semibold text-left">Account No</div>
                  <div className="flex-1 text-[.9rem] text-[#222222] font-medium text-left">{statementData.accountNo || '1271440016276'}</div>
                </div>
                <div className="flex items-center py-[13px] border-b border-[#f2f2f2]">
                  <div className="w-[44%] shrink-0 text-[.78rem] text-[#999999] uppercase tracking-[.5px] font-semibold text-left">Document Type</div>
                  <div className="flex-1 text-[.9rem] text-[#222222] font-medium text-left">CASA Statement</div>
                </div>
                <div className="flex items-center py-[13px] border-b border-[#f2f2f2]">
                  <div className="w-[44%] shrink-0 text-[.78rem] text-[#999999] uppercase tracking-[.5px] font-semibold text-left">Issue Date</div>
                  <div className="flex-1 text-[.9rem] text-[#222222] font-medium text-left">{formatIssueDate(statementData.createdAt || statementData.periodFrom)}</div>
                </div>
                <div className="flex items-center py-[13px] border-b border-[#f2f2f2]">
                  <div className="w-[44%] shrink-0 text-[.78rem] text-[#999999] uppercase tracking-[.5px] font-semibold text-left">Opening Balance</div>
                  <div className="flex-1 text-[.9rem] text-[#222222] font-medium text-left">{statementData.transactions?.[0]?.balance || statementData.closingBalance || '172'}</div>
                </div>
                <div className="flex items-center py-[13px]">
                  <div className="w-[44%] shrink-0 text-[.78rem] text-[#999999] uppercase tracking-[.5px] font-semibold text-left">Closing Balance</div>
                  <div className="flex-1 text-[.9rem] text-[#222222] font-medium text-left">{statementData.closingBalance || '172'}</div>
                </div>
              </div>
            </div>
          )}

          {/* State 3: Manual Direct Input Verification Card (Production EBL Markup) */}
          {viewState === 'MANUAL_INPUT' && (
            <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] overflow-hidden p-[40px_40px_36px]">
              <h1 className="text-[1.5rem] font-bold text-[#111111] mb-2 text-left">Document Verification</h1>
              <p className="text-[.88rem] text-[#666666] mb-[28px] leading-[1.5] text-left">
                Paste the QR value or the full verification URL printed on your EBL certificate to confirm its authenticity.
              </p>

              {manualError && (
                <div className="bg-[#fdecea] text-[#c0392b] rounded-[8px] p-[12px_16px] text-[.85rem] mb-[20px] text-left font-medium">
                  {manualError}
                </div>
              )}

              <form onSubmit={handleManualSubmit}>
                <input
                  type="text"
                  placeholder="QR Value / Verification URL"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full border-[1.5px] border-[#dddddd] rounded-[8px] p-[14px_16px] mb-[16px] text-[.95rem] text-[#222222] outline-none bg-[#fafafa] focus:border-[#003876] focus:bg-white transition-colors"
                  required
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full p-[14px] border-none rounded-[8px] bg-[#F5C518] hover:bg-[#e6b800] text-[#111111] text-[.95rem] font-bold cursor-pointer transition-colors"
                >
                  {isLoading ? 'Verifying...' : 'Verify Document'}
                </button>
              </form>
            </div>
          )}

          {/* State 4: Verification Failed Card (Production EBL Markup) */}
          {viewState === 'FAILED' && (
            <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] overflow-hidden p-[40px_40px_36px]">
              <div className="text-center pt-[8px] pb-[24px]">
                <div className="w-[80px] h-[80px] rounded-full bg-[#fdecea] text-[#c0392b] flex items-center justify-center mx-auto mb-[18px]">
                  <X className="w-9 h-9 stroke-[2.5]" />
                </div>
                <h1 className="text-[1.35rem] font-bold text-[#c0392b] mb-[6px]">Verification Failed</h1>
                <p className="text-[.84rem] text-[#888888]">Document verification failed or document is invalid.</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Footer bar ── */}
      <footer className="site-footer bg-[#F5C518] text-[#003876] text-center text-[.78rem] font-semibold p-[14px] tracking-[.3px]">
        © 2026 Eastern Bank PLC. — All rights reserved.
      </footer>
    </div>


  );
}
