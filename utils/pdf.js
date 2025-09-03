const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function createPdf(images, outputPath) {
  const pdfDoc = await PDFDocument.create();

  for (const imgPath of images) {
    const ext = path.extname(imgPath).toLowerCase();
    let image, page;

    if (ext === ".png") {
      const bytes = fs.readFileSync(imgPath);
      image = await pdfDoc.embedPng(bytes);
    } else if (ext === ".jpg" || ext === ".jpeg") {
      const bytes = fs.readFileSync(imgPath);
      image = await pdfDoc.embedJpg(bytes);
    } else {
      // Convert unsupported format to PNG
      const buffer = await sharp(imgPath).png().toBuffer();
      image = await pdfDoc.embedPng(buffer);
    }

    page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
}

module.exports = { createPdf };
