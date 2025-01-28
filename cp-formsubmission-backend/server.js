const express = require('express');
const cors = require('cors');
const { generateChecklistPDF } = require('./pdfservice');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;

// 1) Map each property to a different recipient email
const propertyEmailMap = {
  'Property 1': 'Nfurrier@picor.com',
  'Property 2': 'Gfurrier@picor.com',
  'Property 3': 'Highspeedmitch@gmail.com',
};

// Temporary storage: in a real app, store in DB
let lastSubmission = null;

app.use(cors());
app.use(express.json());

app.post('/submit-form', async (req, res) => {
  try {
    const data = req.body;
    console.log('Form Data Received:', data);

    const {
      businessName,
      propertyAddress,
      fireSafetyMeasures,
      securitySystems,
      maintenanceSchedule,
      // read selectedProperty if you want to do additional checks
      selectedProperty
    } = data;

    // Validate required fields
    if (
      !businessName ||
      !propertyAddress ||
      !fireSafetyMeasures ||
      !securitySystems ||
      !maintenanceSchedule
    ) {
      return res.status(400).json({
        message: 'All required fields must be completed.',
        success: false,
      });
    }

    // Store the submission (including selectedProperty)
    lastSubmission = data;

    return res.status(200).json({
      message: 'Checklist submitted successfully! Please click "Download PDF".',
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    return res.status(500).json({
      message: 'An error occurred while processing your submission.',
    });
  }
});

app.get('/download-pdf', async (req, res) => {
  try {
    if (!lastSubmission) {
      return res.status(400).json({
        message: 'No form submission found. Please submit the form first.'
      });
    }

    // 1) Generate PDF stream using pdfService
    const pdfStream = await generateChecklistPDF(lastSubmission);

    // 2) Choose a directory for PDF storage
    const pdfStorageDir = "C:\\Users\\Skyli\\OneDrive\\CP-Inspection Reports";

    // 3) Ensure the directory exists
    if (!fs.existsSync(pdfStorageDir)) {
      fs.mkdirSync(pdfStorageDir, { recursive: true });
    }

    // 4) Generate a unique file name
    const fileName = `checklist-${Date.now()}.pdf`;

    // 5) Combine the directory and file name into a full path
    const filePath = path.join(pdfStorageDir, fileName);

    // 6) Create a write stream
    const fileWriteStream = fs.createWriteStream(filePath);

    // 7) Pipe the PDF to the file
    pdfStream.pipe(fileWriteStream);

    // Also pipe to the HTTP response for immediate download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    pdfStream.pipe(res);

    // 8) Once the file finishes writing, email the PDF as an attachment
    fileWriteStream.on('finish', async () => {
      console.log(`PDF saved at: ${filePath}`);

      // Determine which property was selected in the submission
      const { selectedProperty } = lastSubmission;  // e.g. "Property 1"
      console.log('Selected Property:', selectedProperty);

      // Use the map to find the correct recipient
      // default email if property not in map
      const recipientEmail = propertyEmailMap[selectedProperty] || 'highspeedmitch@gmail.com';

      console.log(`Email will be sent to: ${recipientEmail}`);

      // 8a) Create Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'highspeedmitch@gmail.com',
          pass: 'tevt ennm rldu azeh', // for Gmail 2FA, use an App Password
        },
      });

      // 8b) Define mail options
      const mailOptions = {
        from: 'highspeedmitch@gmail.com',
        to: recipientEmail, 
        subject: `Your Checklist PDF for ${selectedProperty || 'Unknown Property'}`,
        text: `Hello! Attached is the PDF for ${selectedProperty}.`,
        attachments: [
          {
            filename: fileName,  // The same name we used for the file
            path: filePath,      // Full path to the saved PDF
          },
        ],
      };

      // 8c) Send the email
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipientEmail}:`, info.response);
      } catch (err) {
        console.error('Error sending email:', err);
      }
    });

    // Handle errors
    pdfStream.on('error', (error) => {
      console.error('PDF stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error generating PDF' });
      }
    });

    fileWriteStream.on('error', (error) => {
      console.error('File write error:', error);
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error generating PDF' });
    }
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something broke!',
    success: false 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
