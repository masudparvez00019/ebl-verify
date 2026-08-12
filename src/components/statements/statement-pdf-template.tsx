'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { getAppUrl } from '@/lib/utils';

export interface StatementData {
  _id?: string;
  qrCodeHash: string;
  customerName: string;
  customerAddress: string;
  branchName: string;
  branchAddress: string;
  accountNo: string;
  productName: string;
  periodFrom: string;
  periodTo: string;
  page: string;
  currencyName: string;
  branchCode: string;
  customerId: string;
  transactions: {
    trnDate: string;
    description: string;
    reference: string;
    debits: string;
    credits: string;
    balance: string;
  }[];
  closingBalance: string;
}

interface TemplateProps {
  data: StatementData;
  containerId?: string;
}

export default function StatementPdfTemplate({ data, containerId = 'statement-pdf-content' }: TemplateProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const baseUrl = getAppUrl();
  const verifyUrl = `${baseUrl}/ebl-cert-portal-flat/verify.php?qr=${data.qrCodeHash || '03F7F3DD19BB7D45899EAF488B7BF2032CF48E6F76DD82AEB458DAF0010FC27B'}`;

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, { width: 130, margin: 0 }, (err, url) => {
      if (!err && url) {
        setQrDataUrl(url);
      }
    });
  }, [verifyUrl]);

  return (
    <div
      id={containerId}
      className="relative w-[794px] min-h-[1123px] pt-8 px-8 pb-0 border shadow-md mx-auto select-none overflow-hidden"
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        borderColor: '#cbd5e1',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {/* Background Watermark - Centered & Light Grey */}
      <div
        className="absolute top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        style={{ backgroundColor: 'transparent' }}
      >
        <span
          className="text-[64px] font-normal select-none"
          style={{
            color: '#d1d5db',
            opacity: 0.35,
            letterSpacing: '0.02em',
          }}
        >
          e-statement
        </span>
      </div>

      <div className="relative z-10 flex flex-col justify-between min-h-[1090px]" style={{ backgroundColor: 'transparent' }}>
        <div>
          {/* Header Top Section: Left Customer Info | Right Unified Header Group */}
          <div className="flex justify-between items-start mb-6">
            {/* Left: Customer & Branch Details */}
            <div className="w-[310px] text-xs leading-tight pt-1" style={{ color: '#000000' }}>
              <div className="font-bold text-[11px] uppercase mb-1" style={{ color: '#000000' }}>
                {data.customerName || 'ZAKIR HOSSAIN'}
              </div>
              <div className="text-[9.5px] leading-relaxed max-w-[250px] mb-10" style={{ color: '#1e293b' }}>
                {data.customerAddress || 'HOUSE-16, L/16, SOUTH BANASREE GORAN  DHAKA'}
              </div>

              <div>
                <div className="text-[9.5px] font-bold mb-0.5" style={{ color: '#000000' }}>
                  {data.branchName || 'Gulshan North Branch'}
                </div>
                <div className="text-[9px] leading-snug max-w-[250px]" style={{ color: '#334155' }}>
                  {data.branchAddress || 'Holding No. 175, Gulshan Avenue, Gulshan-2, Dhaka-1212'}
                </div>
              </div>
            </div>

            {/* Right: QR Code + Logo (Centered with 24px gap) + Head Office Address Box */}
            <div className="flex items-start justify-end gap-6 shrink-0">
              {/* 1. QR Code */}
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt="Verification QR Code" className="w-[100px] h-[100px] object-contain shrink-0" />
              ) : (
                <div
                  className="w-[95px] h-[95px] border flex items-center justify-center text-[10px] shrink-0"
                  style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1', color: '#94a3b8' }}
                >
                  QR Code
                </div>
              )}

              {/* 2. Logo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/acc_statement_logo.jpg"
                alt="Eastern Bank PLC Logo"
                className="h-[82px] w-auto object-contain mt-0.5 shrink-0"
              />

              {/* 3. Head Office Address Box */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/acc_statement_address.jpg"
                alt="Head Office Address"
                className="h-[82px] w-auto object-contain shrink-0"
              />
            </div>
          </div>

          {/* Account Specifications Table Right Aligned */}
          <div className="w-full flex justify-end mb-6 text-xs">
            <table className="w-[320px] text-[9.5px] border-collapse">
              <tbody>
                <tr>
                  <td className="font-normal py-0.5 w-[125px]" style={{ color: '#000000' }}>Account No</td>
                  <td className="font-normal py-0.5" style={{ color: '#000000' }}>: {data.accountNo || '1271440016276'}</td>
                </tr>
                <tr>
                  <td className="font-normal py-0.5" style={{ color: '#000000' }}>Product Name</td>
                  <td className="font-normal py-0.5" style={{ color: '#000000' }}>: {data.productName || 'EBL Power Savings'}</td>
                </tr>
                <tr>
                  <td className="font-normal py-0.5" style={{ color: '#000000' }}>Period From</td>
                  <td className="font-normal py-0.5" style={{ color: '#000000' }}>
                    : {data.periodFrom || '10-AUG-2026'}  -  {data.periodTo || '10-AUG-2026'}
                  </td>
                </tr>
                <tr>
                  <td className="font-normal py-0.5" style={{ color: '#000000' }}>Page</td>
                  <td className="font-normal py-0.5" style={{ color: '#000000' }}>: {data.page || '1'}</td>
                </tr>
                <tr>
                  <td className="font-normal py-0.5" style={{ color: '#000000' }}>Currency Name</td>
                  <td className="font-normal py-0.5" style={{ color: '#000000' }}>: {data.currencyName || 'BANGLADESH TAKA'}</td>
                </tr>
                <tr>
                  <td className="font-normal py-0.5" style={{ color: '#000000' }}>Branch Code</td>
                  <td className="font-normal py-0.5" style={{ color: '#000000' }}>: {data.branchCode || '127'}</td>
                </tr>
                <tr>
                  <td className="font-normal py-0.5" style={{ color: '#000000' }}>Customer ID</td>
                  <td className="font-normal py-0.5" style={{ color: '#000000' }}>: {data.customerId || '3665524'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Transactions Table Header */}
          <div className="mt-7 mb-3">
            <table className="w-full border-collapse text-[9.5px] font-bold" style={{ color: '#000000' }}>
              <tbody>
                <tr>
                  <td className="w-[12%] text-left">TRN. DATE</td>
                  <td className="w-[32%] text-left">DESCRIPTION</td>
                  <td className="w-[20%] text-left">REFERENCE</td>
                  <td className="w-[12%] text-right">DEBITS</td>
                  <td className="w-[12%] text-right">CREDITS</td>
                  <td className="w-[12%] text-right">BALANCE</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Transactions Rows */}
          <div className="min-h-[90px] py-1">
            {data.transactions && data.transactions.length > 0 ? (
              <table className="w-full border-collapse">
                <tbody>
                  {data.transactions.map((tx, idx) => (
                    <tr key={idx} className="text-[9px] leading-tight" style={{ color: '#000000' }}>
                      <td className="w-[12%] py-1 font-mono">{tx.trnDate}</td>
                      <td className="w-[32%] py-1 font-sans uppercase">{tx.description}</td>
                      <td className="w-[20%] py-1 font-mono">{tx.reference}</td>
                      <td className="w-[12%] py-1 text-right font-mono">{tx.debits || ''}</td>
                      <td className="w-[12%] py-1 text-right font-mono">{tx.credits || ''}</td>
                      <td className="w-[12%] py-1 text-right font-mono font-bold">{tx.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-[9.5px] py-4 text-center italic" style={{ color: '#94a3b8' }}>
                No transactions recorded for this statement period.
              </div>
            )}
          </div>

          {/* Continuous Dotted Lines & Statement Closing Balance (Matching Image 1 Pixel-Perfectly) */}
          <div className="w-full mt-6 mb-1.5" style={{ borderTop: '1px dotted #000000', height: '0px' }} />
          <div className="flex justify-between items-center text-[9.5px] font-bold py-1 leading-none" style={{ color: '#000000' }}>
            <span>STATEMENT CLOSING BALANCE</span>
            <span className="font-mono text-[9.5px] font-bold">{data.closingBalance || '0.00'}</span>
          </div>
          <div className="w-full mt-1.5 mb-5" style={{ borderTop: '1px dotted #000000', height: '0px' }} />
        </div>

        {/* Page Footer Section - Clean 14px gap above the Yellow Bar */}
        <div className="mt-auto text-center text-[10px] leading-snug space-y-1 pb-7" style={{ color: '#000000' }}>
          <p className="font-sans">
            This document is verifiable by scanning the above QR code and doesn&apos;t require a seal or signature.
            Verify only via [<span style={{ color: '#0052cc', textDecoration: 'underline' }}>https://selfservicehub.ebl-bd.com</span>]
          </p>
          <p className="font-sans text-[9.5px]">
            IP: +88 09666777325, Email:{' '}
            <span style={{ color: '#0052cc', textDecoration: 'underline' }}>info@ebl-bd.com</span>, Contact Center: 16230 or +88 096 777 16230,
            Web: <span style={{ color: '#0052cc', textDecoration: 'underline' }}>www.ebl.com.bd</span>, Swift: EBLDBDDH
          </p>
        </div>
      </div>

      {/* 100% Full-Bleed Flush Bottom Yellow Bar (Zero Bottom Margin) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[14px] w-full"
        style={{ backgroundColor: '#FFC72C' }}
      />
    </div>
  );
}
