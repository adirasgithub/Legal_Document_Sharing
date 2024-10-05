const twilioClient = require('../config/twilio');

const { sendEmail } = require('../config/email'); // Make sure to import the sendEmail function from your email config

// Send Email via Gmail (or any configured service)
exports.shareByEmail = async (req, res) => {
  try {
    const { email, documentUrl } = req.body;  // Extract email and document URL from the request body
    
    // Check if the required fields are provided
    if (!email || !documentUrl) {
      return res.status(400).json({ error: 'Email and document URL are required.' });
    }

    // Call the sendEmail function
   const response= await sendEmail(
      email,                              // To email address from req.body
      'Your Document is Ready',           // Subject of the email
      'Here is your document From Legal Doc Sharing.',           // Plaintext body of the email
      `<p>Your document is ready. <a href="${documentUrl}">Download here</a></p>`  // HTML body with document URL
    );

    // Return success response
    return res.status(200).json({
      message: `Email sent successfully to ${email}.` ,
      data:response,
    });
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    return res.status(500).json({ error: 'Failed to send email.' });
  }
};

// Send WhatsApp message via Twilio
exports.shareByWhatsApp = async (req, res) => {
  const { whatsappNumber, documentUrl } = req.body;
  // console.log(whatsappNumber, " ", documentUrl);
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
  // console.log("Request received at backend to check status ", messageSid);  // Ensure messageSid is logged as a string
  
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
    // console.error('Error fetching message status:', error);
    res.status(500).json({ message: 'Error fetching message status', error });
  }
};



// Send SMS via Twilio
exports.shareBySMS = async (req, res) => {

  const { phoneNumber, documentUrl } = req.body;
  // console.log(phoneNumber, documentUrl);
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
