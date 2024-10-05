import React, { useState } from 'react';
import { Form, Upload, Button, message, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadDocument, shareByEmail, shareByWhatsApp, shareBySMS, checkWhatsAppStatus } from '../services/api'; // Assuming checkWhatsAppStatus is implemented in your API services.

function UploadForm() {
  const [file, setFile] = useState(null);
  const [documentUrl, setDocumentUrl] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageSid, setMessageSid] = useState(''); // Store message SID for WhatsApp
  const [status, setStatus] = useState(''); // Store message status

  const handleFileChange = ({ file }) => {
    console.log('Selected File:', file);  // Log selected file
    setFile(file);
  };

  const handleSubmit = async () => {
    if (!file) {
      message.error('Please upload a document.');
      return;
    }

    const formData = new FormData();
    formData.append('document', file.originFileObj || file);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await uploadDocument(formData);
      message.success(`File uploaded!`);
      setDocumentUrl(response.data.url);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleShareByEmail = async () => {
    if (!email || !documentUrl) return message.error('Email or document link is missing');
    try {
      await shareByEmail(email, documentUrl);
      message.success('Document shared via email!');
    } catch (error) {
      message.error('Error sharing document via email.');
    }
  };

  const handleShareByWhatsApp = async () => {
    if (!whatsappNumber || !documentUrl) return message.error('WhatsApp number or document link is missing');
    try {
      const response = await shareByWhatsApp(whatsappNumber, documentUrl);
      message.success(response.data.message);
      console.log("printing console at frontend" , response);
      setMessageSid(response.data.data.sid); // Save the message SID for status checking
    } catch (error) {
      message.error('Error sharing document via WhatsApp.');
    }
  };

  const handleShareBySMS = async () => {
    if (!phoneNumber || !documentUrl) return message.error('Phone number or document link is missing');
    try {
      await shareBySMS(phoneNumber, documentUrl);
      message.success('Document shared via SMS!');
    } catch (error) {
      message.error('Error sharing document via SMS.');
    }
  };

  // Function to check WhatsApp message status
  const handleCheckWhatsAppStatus = async () => {
    if (!messageSid) {
      return message.error('No WhatsApp message SID available. Send a message first.');
    }

    try {
      const response = await checkWhatsAppStatus({ messageSid });
      setStatus(response.data.status); // Set status to display it
      message.success(`Message status: ${response.data.status}`);
    } catch (error) {
      message.error('Error checking message status.');
    }
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="Upload Document" required>
          <Upload
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleFileChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Click to Upload PDF</Button>
          </Upload>
        </Form.Item>
        <Button type="primary" onClick={handleSubmit}>
          Upload Document
        </Button>
      </Form>
      {documentUrl && (
        <div>
          <p>Document uploaded! URL: {documentUrl}</p>

          <Form.Item label="Email">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
          </Form.Item>
          <Button type="primary" onClick={handleShareByEmail}>Share via Email</Button>

          <Form.Item label="WhatsApp Number">
            <Input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="Enter WhatsApp number" />
          </Form.Item>
          <Button type="primary" onClick={handleShareByWhatsApp}>Share via WhatsApp</Button>

          <Form.Item label="Phone Number (SMS)">
            <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter phone number" />
          </Form.Item>
          <Button type="primary" onClick={handleShareBySMS}>Share via SMS</Button>

          {/* Check WhatsApp Status Button */}
          <Button type="primary" onClick={handleCheckWhatsAppStatus} style={{ marginTop: '10px' }}>
            Check WhatsApp Message Status
          </Button>

          {/* Display Message Status */}
          {status && <p>WhatsApp Message Status: {status}</p>}
        </div>
      )}
    </div>
  );
}

export default UploadForm;
