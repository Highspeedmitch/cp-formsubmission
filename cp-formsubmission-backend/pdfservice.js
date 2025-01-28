const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

/**
 * Generates a PDF in-memory from the submitted data and returns it as a stream.
 */
async function generateChecklistPDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const passThrough = new PassThrough();

      // Handle stream errors
      doc.on('error', (error) => {
        reject(error);
      });

      passThrough.on('error', (error) => {
        reject(error);
      });

      doc.pipe(passThrough);

      // Title
      doc.fontSize(18).text('Commercial Property Insurance Risk Mitigation Checklist', {
        align: 'center',
        underline: true
      });
      doc.moveDown();

      // Basic Info
      doc.fontSize(14).text('Business Information', { underline: true });
      doc.fontSize(12)
        .text(`Business Name: ${data.businessName || 'N/A'}`)
        .text(`Property Address: ${data.propertyAddress || 'N/A'}`);
      doc.moveDown();

      // Risk Mitigation Details
      doc.fontSize(14).text('Risk Mitigation Details', { underline: true });
      doc.fontSize(12).list([
        `Fire Safety Measures: ${data.fireSafetyMeasures || 'N/A'}`,
        `Security Systems: ${data.securitySystems || 'N/A'}`,
        `Maintenance Schedule: ${data.maintenanceSchedule || 'N/A'}`,
      ]);
      doc.moveDown();

      // Additional Condition Checks
      doc.fontSize(14).text('Additional Property Condition Checks', { underline: true });
      doc.fontSize(12).list([
        `Parking Lot Lights: ${data.parkingLotLights || 'N/A'}`,
        `Under Canopy Lights: ${data.underCanopyLights || 'N/A'}`,
        `Parking Bumpers: ${data.parkingBumpers || 'N/A'}`,
        `Dumpsters: ${data.dumpsters || 'N/A'}`,
        `Water Leaks: ${data.waterLeaks || 'N/A'}`,
        `Trees Requiring Attention: ${data.dangerousTrees || 'N/A'}`,
        `Trash Cans: ${data.trashCans || 'N/A'}`,
        `Broken Curbs: ${data.brokenCurbs || 'N/A'}`,
        `Potholes: ${data.potholes || 'N/A'}`,
      ]);
      doc.moveDown();

      // Additional Notes
      doc.fontSize(14).text('Additional Notes', { underline: true });
      doc.fontSize(12).text(data.additionalNotes || 'No additional notes');
      doc.moveDown();

      // Footer
      doc.fontSize(10).text(
        `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        { align: 'right' }
      );

      // Handle successful PDF creation
      doc.end();

      // Resolve with the stream once the document is finished
      doc.on('end', () => {
        resolve(passThrough);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateChecklistPDF };