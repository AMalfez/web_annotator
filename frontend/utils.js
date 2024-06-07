// const PDFDocument = require('pdfkit');
import PDFDocument from 'pdfkit';

document.addEventListener('DOMContentLoaded',()=>{
    const ExportBtn = document.getElementsByClassName("export_highlight_btn")[0];

  ExportBtn.addEventListener("click",()=>{
    downloadPDF();
  })
})

const downloadPDF=()=>{
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('output.pdf'));
    doc.font('fonts/PalatinoBold.ttf').fontSize(25).text('Some text with an embedded font!', 100, 100);
    doc.end();
}