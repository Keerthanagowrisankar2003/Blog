const nodemailer = require('nodemailer');

// Function to send OTP via email
const sendOTP = async (email, otp) => {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com', // Your Gmail email address
      pass: 'your_email_password', // Your Gmail email password
    },
  });

  // Setup email data
  const mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: 'Verification OTP',
    text: `Your OTP for email verification is: ${otp}`,
  };

  // Send mail with defined transport object
  await transporter.sendMail(mailOptions);
};
