import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your server URL
});

export const uploadDocument = (formData) => {
  return api.post('/upload', formData);
};

export const shareByEmail = (email, documentUrl) => {
  return api.post('/share/email', { email, documentUrl });
};

export const shareByWhatsApp = (whatsappNumber, documentUrl) => {
  return api.post('/share/whatsapp', { whatsappNumber, documentUrl });
};

export const shareBySMS = (phoneNumber, documentUrl) => {
  return api.post('/share/sms', { phoneNumber, documentUrl });
};

// Updated function using axios instead of fetch
export const checkWhatsAppStatus = (messageSid) => {
  return api.post('/get-status', { messageSid });
};
