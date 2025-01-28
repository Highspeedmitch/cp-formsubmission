// pdfService.js
const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

/**
 * Generates a PDF checklist in-memory using pdfkit and
 * returns a Readable Stream (passThrough) containing the PDF data.
 */
function generateChecklistPDF(data) {
  const doc = new PDFDocument();
  const passThrough = new PassThrough();

  // Pipe the PDF document to the PassThrough stream
  doc.pipe(passThrough);

  // PDF Title
  doc.fontSize(18).text('Commercial Property Insurance Risk Mitigation Checklist', {
    align: 'center',
    underline: true,
  });
  doc.moveDown();

  // Subheading
  doc.fontSize(14).text('Submitted Information', { align: 'left' });
  doc.moveDown(0.5);

  // BUSINESS NAME & ADDRESS
  doc.fontSize(12).text(`Business Name: ${data.businessName}`);
  doc.text(`Property Address: ${data.propertyAddress}`);
  doc.moveDown(1);

  // FIRE SAFETY
  doc.fontSize(14).text('Risk Mitigation Details', { underline: true });
  doc.fontSize(12).list([
    `Fire Safety Measures: ${data.fireSafetyMeasures}`,
    `Security Systems: ${data.securitySystems}`,
    `Maintenance Schedule: ${data.maintenanceSchedule}`,
  ]);
  doc.moveDown(1);

  // ADDITIONAL INSPECTIONS
  doc.fontSize(14).text('Additional Inspections', { underline: true });
  doc.fontSize(12).list([
    `Parking Lot Lights: ${data.parkingLotLights}`,
    `Under Canopy Lights: ${data.underCanopyLights}`,
    `Parking Bumpers: ${data.parkingBumpers}`,
    `Dumpsters: ${data.dumpsters}`,
    `Water Leaks: ${data.waterLeaks}`,
    `Trees Needing Attention: ${data.dangerousTrees}`,
    `Trash Cans: ${data.trashCans}`,
    `Broken Curbing: ${data.brokenCurbs}`,
    `Potholes / Major Repairs: ${data.potholes}`,
  ]);
  doc.moveDown(1);

  // ADDITIONAL NOTES
  doc.fontSize(14).text('Additional Notes', { underline: true });
  doc.fontSize(12).text(`${data.additionalNotes}`);
  doc.moveDown(2);

  // FOOTER
  doc.fontSize(10).text(
    `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
    { align: 'right' }
  );

  // Finalize the PDF and end the stream
  doc.end();

  return passThrough;
}

module.exports = { generateChecklistPDF };
