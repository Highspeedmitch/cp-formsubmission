import React, { useState } from 'react';

/**
 * This component:
 * 1. Shows three property tiles (Property 1, Property 2, Property 3)
 * 2. Once a property is selected, displays the full commercial property checklist form
 * 3. Submits data (including the selected property) to your server
 * 4. Offers a "Download PDF" button after submission
 * 5. Is styled for better mobile/iOS usability
 */
function MobileFriendlyApp() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // All form fields
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

  // Handle text/textarea changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Submit the form to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Include selectedProperty so the server knows which property is being submitted
      const payload = { ...formData, selectedProperty };

      const response = await fetch('http://localhost:5000/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  // Download the PDF if the form was submitted
  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('http://localhost:5000/download-pdf');
      if (!response.ok) {
        const errorData = await response.json();
        alert('Error downloading PDF: ' + errorData.message);
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'checklist.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };

  // Show property selection if none is chosen yet
  if (!selectedProperty) {
    return (
      <div style={styles.propertySelectionContainer}>
        <h1 style={styles.heading}>Select a Property</h1>
        <div style={styles.propertyBoxContainer}>
          <div
            onClick={() => setSelectedProperty('Property 1')}
            style={styles.propertyBox}
          >
            Property 1
          </div>
          <div
            onClick={() => setSelectedProperty('Property 2')}
            style={styles.propertyBox}
          >
            Property 2
          </div>
          <div
            onClick={() => setSelectedProperty('Property 3')}
            style={styles.propertyBox}
          >
            Property 3
          </div>
        </div>
      </div>
    );
  }

  // If a property is selected, show the full form
  return (
    <div style={styles.formContainer}>
      <h1 style={styles.formHeading}>
        {selectedProperty} – Commercial Property Insurance Risk Mitigation Checklist
      </h1>

      {/* Show download button if form is submitted */}
      {isSubmitted && (
        <div style={{ margin: '1rem 0' }}>
          <button onClick={handleDownloadPDF} style={styles.downloadButton}>
            Download PDF
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Business Name */}
        <div style={styles.formGroup}>
          <label htmlFor="businessName" style={styles.label}>Business Name:</label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            placeholder="Enter your business name"
            value={formData.businessName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* Property Address */}
        <div style={styles.formGroup}>
          <label htmlFor="propertyAddress" style={styles.label}>Property Address:</label>
          <input
            type="text"
            id="propertyAddress"
            name="propertyAddress"
            placeholder="Enter the property address"
            value={formData.propertyAddress}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* Fire Safety Measures */}
        <div style={styles.formGroup}>
          <label htmlFor="fireSafetyMeasures" style={styles.label}>Fire Safety Measures:</label>
          <textarea
            id="fireSafetyMeasures"
            name="fireSafetyMeasures"
            placeholder="Describe fire safety measures in place"
            rows="3"
            value={formData.fireSafetyMeasures}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>

        {/* Security Systems */}
        <div style={styles.formGroup}>
          <label htmlFor="securitySystems" style={styles.label}>Security Systems:</label>
          <textarea
            id="securitySystems"
            name="securitySystems"
            placeholder="Describe security systems in place"
            rows="3"
            value={formData.securitySystems}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>

        {/* Maintenance Schedule */}
        <div style={styles.formGroup}>
          <label htmlFor="maintenanceSchedule" style={styles.label}>Maintenance Schedule:</label>
          <textarea
            id="maintenanceSchedule"
            name="maintenanceSchedule"
            placeholder="Provide details of the maintenance schedule"
            rows="3"
            value={formData.maintenanceSchedule}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>

        <h2 style={styles.sectionHeading}>Additional Property Condition Checks</h2>

        {/* Parking Lot Lights */}
        <div style={styles.formGroup}>
          <label htmlFor="parkingLotLights" style={styles.label}>
            Parking lot lights – any burned out?
          </label>
          <textarea
            id="parkingLotLights"
            name="parkingLotLights"
            placeholder="Describe any issues with parking lot lighting"
            rows="2"
            value={formData.parkingLotLights}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        {/* Under Canopy Lights */}
        <div style={styles.formGroup}>
          <label htmlFor="underCanopyLights" style={styles.label}>
            Under canopy lights / Tenant signs, are they illuminated?
          </label>
          <textarea
            id="underCanopyLights"
            name="underCanopyLights"
            placeholder="Note if under canopy lights or tenant signs are not functioning"
            rows="2"
            value={formData.underCanopyLights}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        {/* Parking Bumpers */}
        <div style={styles.formGroup}>
          <label htmlFor="parkingBumpers" style={styles.label}>
            Parking bumpers, any out of place or rebar sticking up?
          </label>
          <textarea
            id="parkingBumpers"
            name="parkingBumpers"
            placeholder="Identify hazards with parking bumpers or rebar"
            rows="2"
            value={formData.parkingBumpers}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        {/* Dumpsters */}
        <div style={styles.formGroup}>
          <label htmlFor="dumpsters" style={styles.label}>
            Dumpsters, trash thrown about?
          </label>
          <textarea
            id="dumpsters"
            name="dumpsters"
            placeholder="Observe dumpster area cleanliness"
            rows="2"
            value={formData.dumpsters}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        {/* Water Leaks */}
        <div style={styles.formGroup}>
          <label htmlFor="waterLeaks" style={styles.label}>
            Water leaks?
          </label>
          <textarea
            id="waterLeaks"
            name="waterLeaks"
            placeholder="Document any visible water leaks"
            rows="2"
            value={formData.waterLeaks}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        {/* Dangerous Trees */}
        <div style={styles.formGroup}>
          <label htmlFor="dangerousTrees" style={styles.label}>
            Trees that look like they are going to fall or need trimming?
          </label>
          <textarea
            id="dangerousTrees"
            name="dangerousTrees"
            placeholder="List any trees needing attention"
            rows="2"
            value={formData.dangerousTrees}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        {/* Trash Cans */}
        <div style={styles.formGroup}>
          <label htmlFor="trashCans" style={styles.label}>
            Trash cans, overflowing?
          </label>
          <textarea
            id="trashCans"
            name="trashCans"
            placeholder="Note if trash cans are full or overflowing"
            rows="2"
            value={formData.trashCans}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        {/* Broken Curbs */}
        <div style={styles.formGroup}>
          <label htmlFor="brokenCurbs" style={styles.label}>
            Broken parking lot curbing?
          </label>
          <textarea
            id="brokenCurbs"
            name="brokenCurbs"
            placeholder="Identify any damage to curbing"
            rows="2"
            value={formData.brokenCurbs}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        {/* Potholes */}
        <div style={styles.formGroup}>
          <label htmlFor="potholes" style={styles.label}>
            Major potholes in the asphalt or other major repairs?
          </label>
          <textarea
            id="potholes"
            name="potholes"
            placeholder="Describe any large potholes or needed repairs"
            rows="2"
            value={formData.potholes}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        <h2 style={styles.sectionHeading}>Additional Notes</h2>

        <div style={styles.formGroup}>
          <label htmlFor="additionalNotes" style={styles.label}>
            Additional Notes:
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            placeholder="Include any additional notes or details"
            rows="4"
            value={formData.additionalNotes}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button type="submit" style={styles.submitButton}>
            Submit Checklist
          </button>
        </div>
      </form>
    </div>
  );
}

export default MobileFriendlyApp;

/* --- Inline Styles for Mobile Optimization --- */
const styles = {
  propertySelectionContainer: {
    textAlign: 'center',
    padding: '1rem',
    margin: '0 auto',
    maxWidth: '600px'
  },
  heading: {
    fontSize: '1.5rem'
  },
  propertyBoxContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap', // allows wrap on small screens
    gap: '1rem',
    marginTop: '2rem'
  },
  propertyBox: {
    width: '120px',
    height: '120px',
    backgroundColor: '#eee',
    border: '2px solid #ccc',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease'
  },
  formContainer: {
    margin: '0 auto',
    maxWidth: '600px',
    padding: '1rem'
  },
  formHeading: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '0.3rem'
  },
  input: {
    padding: '0.7rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  textarea: {
    padding: '0.7rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical'
  },
  sectionHeading: {
    fontSize: '1.1rem',
    margin: '1.2rem 0 0.8rem 0'
  },
  submitButton: {
    padding: '0.8rem 1.2rem',
    backgroundColor: '#007BFF',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  downloadButton: {
    padding: '0.8rem 1.2rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};
