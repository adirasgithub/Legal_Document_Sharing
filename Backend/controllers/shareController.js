const sgMail = require('@sendgrid/mail');
const twilioClient = require('../config/twilio');

// Send Email via SendGrid
exports.shareByEmail = async (req, res) => {
  const { email, documentUrl } = req.body;
  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: email,
    from: 'your-email@example.com',
    subject: 'Document Sharing',
    text: `You can access the document here: ${documentUrl}`,
    html: `<p>You can access the document here: <a href="${documentUrl}">Download Document</a></p>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error });
  }
};

// Send WhatsApp message via Twilio
exports.shareByWhatsApp = async (req, res) => {
  const { whatsappNumber, documentUrl } = req.body;
  console.log(whatsappNumber, " ", documentUrl);
  try {
    const response = await twilioClient.messages.create({
      body: `Here is your document from Legal Doc Sharing WebApp Click on the Link to Open to : ${documentUrl}`,
      from: 'whatsapp:+14155238886', // Your Twilio sandbox WhatsApp number
      to: `whatsapp:+91${whatsappNumber}`,
    });
    res.status(200).json({
      message: 'WhatsApp message sent successfully!',
      data:response
     });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ message: 'Error sending WhatsApp message', error });
  }
};
// Function to check the message status
exports.checkWhatsAppMessageStatus = async (req, res) => {
  const { messageSid } = req.body.messageSid;
  console.log("Request received at backend to check status ", messageSid);  // Ensure messageSid is logged as a string
  
  try {
    const message = await twilioClient.messages(messageSid).fetch();  // Ensure messageSid is passed as a string
    res.status(200).json({
      message: 'Message status fetched successfully!',
      status: message.status,  // Can be queued, sent, delivered, or failed
      dateSent: message.dateSent,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
    });
  } catch (error) {
    console.error('Error fetching message status:', error);
    res.status(500).json({ message: 'Error fetching message status', error });
  }
};



// Send SMS via Twilio
exports.shareBySMS = async (req, res) => {

  const { phoneNumber, documentUrl } = req.body;
  console.log(phoneNumber, documentUrl);
  try {
    await twilioClient.messages.create({
      body: `Here is your document: ${documentUrl}`,
      from: process.env.TWILIO_PHONE_NUMBER,
       to: `+91${phoneNumber}`,
    });
    res.status(200).json({ message: 'SMS sent successfully!' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ message: 'Error sending SMS', error });
  }
};
