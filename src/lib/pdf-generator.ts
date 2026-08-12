import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { StatementData } from '@/components/statements/statement-pdf-template';
import { getAppUrl } from '@/lib/utils';

export async function generateCleanPdf(statement: StatementData): Promise<void> {
  const baseUrl = getAppUrl();
  const verifyUrl = `${baseUrl}/ebl-cert-portal-flat/verify.php?qr=${
    statement.qrCodeHash || '03F7F3DD19BB7D45899EAF488B7BF2032CF48E6F76DD82AEB458DAF0010FC27B'
  }`;

  // 1. Generate QR Code Data URL
  const qrDataUrl = await new Promise<string>((resolve) => {
    QRCode.toDataURL(verifyUrl, { width: 140, margin: 0 }, (err, url) => {
      resolve(url || '');
    });
  });

  // 2. Build Transactions Rows HTML
  let transactionsHtml = '';
  if (statement.transactions && statement.transactions.length > 0) {
    transactionsHtml = statement.transactions
      .map(
        (tx) => `
        <tr style="font-family: monospace; font-size: 9px; color: #000000;">
          <td style="padding: 4px 0; width: 12%; font-family: monospace;">${tx.trnDate || ''}</td>
          <td style="padding: 4px 0; width: 32%; font-family: Arial, sans-serif; font-size: 9px; text-transform: uppercase;">${tx.description || ''}</td>
          <td style="padding: 4px 0; width: 20%; font-family: monospace;">${tx.reference || ''}</td>
          <td style="padding: 4px 0; width: 12%; text-align: right; font-family: monospace;">${tx.debits || ''}</td>
          <td style="padding: 4px 0; width: 12%; text-align: right; font-family: monospace;">${tx.credits || ''}</td>
          <td style="padding: 4px 0; width: 12%; text-align: right; font-family: monospace; font-weight: bold;">${tx.balance || ''}</td>
        </tr>
      `
      )
      .join('');
  } else {
    transactionsHtml = `
      <tr>
        <td colspan="6" style="padding: 24px; text-align: center; font-style: italic; font-size: 9.5px; color: #94a3b8;">
          No transactions recorded for this statement period.
        </td>
      </tr>
    `;
  }

  // 3. Construct Clean HTML string matching Image 1 layout
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>EBL Statement</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #ffffff; color: #000000; font-family: Arial, Helvetica, sans-serif; }
        </style>
      </head>
      <body>
        <div id="pdf-root" style="position: relative; width: 794px; min-height: 1123px; background: #ffffff; color: #000000; padding: 32px 32px 0 32px; box-sizing: border-box; font-family: Arial, sans-serif; overflow: hidden;">
          
          <!-- Watermark: Light Grey, Centered -->
          <div style="position: absolute; top: 55%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 0;">
            <span style="font-size: 64px; font-weight: normal; color: #d1d5db; opacity: 0.35; letter-spacing: 0.02em;">
              e-statement
            </span>
          </div>

          <!-- Document Container -->
          <div style="position: relative; z-index: 10; display: flex; flex-direction: column; justify-content: space-between; min-height: 1090px;">
            
            <div>
              <!-- Header Top Grid -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="vertical-align: top;">
                  <!-- Left: Customer Details -->
                  <td style="width: 310px; font-size: 10px; color: #000000; line-height: 1.35; padding-top: 4px;">
                    <div style="font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 4px; color: #000000;">
                      ${statement.customerName || 'ZAKIR HOSSAIN'}
                    </div>
                    <div style="font-size: 9.5px; color: #1e293b; max-width: 250px; margin-bottom: 40px;">
                      ${statement.customerAddress || 'HOUSE-16, L/16, SOUTH BANASREE GORAN  DHAKA'}
                    </div>
                    <div style="font-weight: bold; font-size: 9.5px; color: #000000; margin-bottom: 2px;">
                      ${statement.branchName || 'Gulshan North Branch'}
                    </div>
                    <div style="font-size: 9px; color: #334155; max-width: 250px;">
                      ${statement.branchAddress || 'Holding No. 175, Gulshan Avenue, Gulshan-2, Dhaka-1212'}
                    </div>
                  </td>

                  <!-- Right: QR Code + Logo in Middle + Head Office Address Box -->
                  <td style="text-align: right;">
                    <div style="display: flex; align-items: flex-start; justify-content: flex-end; gap: 24px;">
                      <!-- 1. QR Code -->
                      ${
                        qrDataUrl
                          ? `<img src="${qrDataUrl}" style="width: 100px; height: 100px; object-fit: contain; display: inline-block;" />`
                          : ''
                      }
                      <!-- 2. Eastern Bank PLC Logo -->
                      <img src="${window.location.origin}/acc_statement_logo.jpg" style="height: 82px; width: auto; object-fit: contain; margin-top: 2px;" />
                      <!-- 3. Head Office Address Box -->
                      <img src="${window.location.origin}/acc_statement_address.jpg" style="height: 82px; width: auto; object-fit: contain;" />
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Account Specifications Grid -->
              <div style="width: 100%; display: flex; justify-content: flex-end; margin-bottom: 24px;">
                <table style="width: 320px; font-size: 9.5px; border-collapse: collapse; float: right;">
                  <tr>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0; width: 125px;">Account No</td>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0;">: ${statement.accountNo || '1271440016276'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0;">Product Name</td>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0;">: ${statement.productName || 'EBL Power Savings'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0;">Period From</td>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0;">: ${statement.periodFrom || '10-AUG-2026'}  -  ${statement.periodTo || '10-AUG-2026'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0;">Page</td>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0;">: ${statement.page || '1'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0;">Currency Name</td>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0;">: ${statement.currencyName || 'BANGLADESH TAKA'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0;">Branch Code</td>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0;">: ${statement.branchCode || '127'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0;">Customer ID</td>
                    <td style="font-weight: normal; color: #000000; padding: 2.5px 0;">: ${statement.customerId || '3665524'}</td>
                  </tr>
                </table>
                <div style="clear: both;"></div>
              </div>

              <!-- Transactions Table Header -->
              <div style="margin-top: 28px; margin-bottom: 12px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 9.5px; font-weight: bold; color: #000000;">
                  <tr>
                    <td style="width: 12%; text-align: left;">TRN. DATE</td>
                    <td style="width: 32%; text-align: left;">DESCRIPTION</td>
                    <td style="width: 20%; text-align: left;">REFERENCE</td>
                    <td style="width: 12%; text-align: right;">DEBITS</td>
                    <td style="width: 12%; text-align: right;">CREDITS</td>
                    <td style="width: 12%; text-align: right;">BALANCE</td>
                  </tr>
                </table>
              </div>

              <!-- Transactions List Rows -->
              <div style="min-height: 90px; padding: 2px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  ${transactionsHtml}
                </table>
              </div>

              <!-- Continuous Dotted Lines & Statement Closing Balance (Matching Image 1 Pixel-Perfectly) -->
              <div style="width: 100%; margin-top: 24px; margin-bottom: 6px; border-top: 1px dotted #000000; height: 0px;"></div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; font-weight: bold; color: #000000; padding: 2px 0; line-height: 1;">
                <span>STATEMENT CLOSING BALANCE</span>
                <span style="font-family: monospace; font-size: 9.5px; font-weight: bold;">${statement.closingBalance || '0.00'}</span>
              </div>
              <div style="width: 100%; margin-top: 6px; margin-bottom: 20px; border-top: 1px dotted #000000; height: 0px;"></div>
            </div>

            <!-- Page Footer Section - Clean 14px gap above the Yellow Bar -->
            <div style="margin-top: auto; padding-top: 16px; text-align: center; font-size: 10px; color: #000000; line-height: 1.35; padding-bottom: 28px;">
              <p style="margin-bottom: 3px;">
                This document is verifiable by scanning the above QR code and doesn't require a seal or signature.
                Verify only via [<span style="color: #0052cc; text-decoration: underline;">https://selfservicehub.ebl-bd.com</span>]
              </p>
              <p style="font-size: 9.5px; color: #1e293b;">
                IP: +88 09666777325, Email: <span style="color: #0052cc; text-decoration: underline;">info@ebl-bd.com</span>, Contact Center: 16230 or +88 096 777 16230, Web: <span style="color: #0052cc; text-decoration: underline;">www.ebl.com.bd</span>, Swift: EBLDBDDH
              </p>
            </div>

          </div>

          <!-- 100% Full-Bleed Flush Bottom Yellow Bar (Zero Bottom Margin) -->
          <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 14px; width: 100%; background-color: #FFC72C;"></div>

        </div>
      </body>
    </html>
  `;

  // 4. Create Sandboxed Invisible IFrame
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '-9999px';
  iframe.style.width = '820px';
  iframe.style.height = '1150px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    throw new Error('Failed to create isolated print document frame');
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  // 5. Wait for Images to load inside iframe
  await new Promise((r) => setTimeout(r, 450));

  const targetElement = doc.getElementById('pdf-root');
  if (!targetElement) {
    document.body.removeChild(iframe);
    throw new Error('Target element not found in isolated iframe');
  }

  // 6. Capture canvas with html2canvas inside isolated iframe
  const canvas = await html2canvas(targetElement, {
    scale: 2.5,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  // 7. Cleanup IFrame
  document.body.removeChild(iframe);

  // 8. Generate A4 PDF with jsPDF & Save as acc_statement_<Date>.pdf
  const imgData = canvas.toDataURL('image/jpeg', 0.98);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  // Format date string for filename based on real current download date: acc_statement_12_Aug_2026.pdf
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayStr = String(now.getDate()).padStart(2, '0');
  const monthStr = months[now.getMonth()];
  const yearStr = now.getFullYear();

  const fileName = `acc_statement_${dayStr}_${monthStr}_${yearStr}.pdf`;

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(fileName);
}
