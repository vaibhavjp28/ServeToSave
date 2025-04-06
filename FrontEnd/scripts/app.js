// DONATION FORM SUBMISSION
document.getElementById('donateForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    const fileInput = document.getElementById('donateDocument');
  
    formData.append('foodName', document.getElementById('donateFoodName').value);
    formData.append('quantity', document.getElementById('donateQuantity').value);
    formData.append('pickupTime', document.getElementById('donatePickupTime').value);
    formData.append('bestBefore', document.getElementById('best-before').value);
    formData.append('location', document.getElementById('donateLocation').value);
    formData.append('contact', document.getElementById('donateContact').value);
    formData.append('documentType', document.getElementById('donateDocumentType').value);
    formData.append('document', fileInput.files[0]);
  
    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) throw new Error('Donation submission failed');
  
      const result = await response.json();
      alert(result.message);
      location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  });
  
  // REQUEST FORM SUBMISSION
  document.getElementById('requestForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    const fileInput = document.getElementById('requestDocument');
  
    formData.append('requesterName', document.getElementById('requesterName').value);
    formData.append('neededQuantity', document.getElementById('neededQuantity').value);
    formData.append('requestLocation', document.getElementById('requestLocation').value);
    formData.append('requestContact', document.getElementById('requestContact').value);
    formData.append('documentType', document.getElementById('requestDocumentType').value);
    formData.append('document', fileInput.files[0]);
  
    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) throw new Error('Request submission failed');
  
      const result = await response.json();
      alert(result.message);
      location.reload();
    } catch (error) {
      console.error('Request Error:', error);
      alert(`Error: ${error.message}`);
    }
  });
  
  // LOAD DONATIONS TABLE (for donations.html)
  async function loadDonations() {
    const tbody = document.getElementById('donations-body');
    if (!tbody) return;
  
    try {
      const response = await fetch('/api/donations');
      const donations = await response.json();
  
      tbody.innerHTML = donations.map(d => `
        <tr>
          <td>${d.foodName}</td>
          <td>${d.quantity}</td>
          <td>${new Date(d.pickupTime).toLocaleString()}</td>
          <td>${d.location}</td>
          <td>${d.contact}</td>
          <td>${d.documentType}</td>
          <td>${d.documentPath ? `<a href="${d.documentPath}" target="_blank">View</a>` : 'N/A'}</td>
        </tr>
      `).join('');
    } catch (error) {
      console.error('Loading donations failed:', error);
      tbody.innerHTML = `<tr><td colspan="7">Error loading data.</td></tr>`;
    }
  }
  
  window.addEventListener('DOMContentLoaded', loadDonations);
  