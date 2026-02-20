import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


export const sendContactNotification = async (contactData) => {
    try {
        const { name, email, message } = contactData;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'bob1977singh@gmail.com', // Your admin email
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #ec4899; margin-bottom: 20px;">📧 New Contact Form Submission</h2>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                            <p style="margin: 5px 0;"><strong style="color: #333;">Name:</strong> ${name}</p>
                            <p style="margin: 5px 0;"><strong style="color: #333;">Email:</strong> <a href="mailto:${email}" style="color: #4f46e5;">${email}</a></p>
                        </div>
                        
                        <div style="background-color: #fff; padding: 15px; border-left: 4px solid #ec4899; margin-top: 20px;">
                            <p style="margin: 5px 0; color: #666;"><strong style="color: #333;">Message:</strong></p>
                            <p style="margin: 10px 0 5px 0; color: #333; line-height: 1.6;">${message}</p>
                        </div>
                        
                        <p style="margin-top: 25px; font-size: 12px; color: #999; text-align: center;">
                            Sent from Helping Hands NGO website
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Contact notification sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending contact notification:', error);
        return false;
    }
};
