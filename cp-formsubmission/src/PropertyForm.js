// src/PropertyForm.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function PropertyForm() {
  const { propertyId } = useParams();  // e.g. 'property1', 'property2', 'property3'
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    businessName: '',
    propertyAddress: '',
    fireSafetyMeasures: '',
    securitySystems: '',
    maintenanceSchedule: '',
    additionalNotes: '',
    parkingLotLights: '',
    underCanopyLights: '',
    parkingBumpers: '',
    dumpsters: '',
    waterLeaks: '',
    dangerousTrees: '',
    trashCans: '',
    brokenCurbs: '',
    potholes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Include which property was chosen
      const submission = { ...formData, propertyId };

      const response = await fetch('http://localhost:5000/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        alert(data.message);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  // If form is submitted, user can download PDF
  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('http://localhost:5000/download-pdf');
      if (!response.ok) {
        const errData = await response.json();
        alert('Error downloading PDF: ' + errData.message);
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'checklist.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <h1>{propertyId} - Commercial Property Checklist</h1>

      {isSubmitted && (
        <div style={{ margin: '1rem 0' }}>
          <button onClick={handleDownloadPDF}>Download PDF</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Business Name */}
        <div>
          <label htmlFor="businessName">Business Name:</label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Property Address */}
        <div>
          <label htmlFor="propertyAddress">Property Address:</label>
          <input
            type="text"
            id="propertyAddress"
            name="propertyAddress"
            value={formData.propertyAddress}
            onChange={handleChange}
            required
          />
        </div>

        {/* Fire Safety... etc. (rest of your fields) */}
        {/* ... Same fields as your existing code ... */}

        <button type="submit" style={{ marginTop: '1rem' }}>Submit Checklist</button>
      </form>
    </div>
  );
}

export default PropertyForm;
