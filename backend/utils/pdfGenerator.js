const puppeteer = require('puppeteer');

/**
 * Generates a professional invoice PDF using Puppeteer by rendering the exact frontend layout.
 * @param {Object} bill - The bill object from MongoDB
 * @param {String} clientUrl - The origin URL of the frontend (e.g. http://localhost:5173)
 * @returns {Promise<Buffer>}
 */
async function generateBillPDF(bill, clientUrl = 'http://localhost:5173') {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const targetUrl = `${clientUrl}/admin/bill/${bill._id}`;
    console.log(`Generating PDF from: ${targetUrl}`);
    
    // Wait for network to be idle so images/fonts load properly
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 15000 });
    
    const pdfBuffer = await page.pdf({ 
      format: 'A4', 
      printBackground: true
    });
    
    return Buffer.from(pdfBuffer);
  } catch (err) {
    console.error('Puppeteer PDF generation failed:', err);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { generateBillPDF };
