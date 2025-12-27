/**
 * Professional HTML Email Templates for Architect Santhosh
 */

const baseStyle = `
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  color: #333333;
`;

const headerStyle = `
  background-color: #111111;
  padding: 40px 20px;
  text-align: center;
  border-bottom: 4px solid #c5a059;
`;

const logoStyle = `
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-decoration: none;
`;

const contentStyle = `
  padding: 40px 30px;
  line-height: 1.6;
`;

const footerStyle = `
  background-color: #f9f9f9;
  padding: 30px;
  text-align: center;
  font-size: 12px;
  color: #999999;
  border-top: 1px solid #eeeeee;
`;

const buttonStyle = `
  display: inline-block;
  padding: 15px 30px;
  background-color: #c5a059;
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 20px 0;
`;

const otpBoxStyle = `
  background-color: #f4f4f4;
  padding: 30px;
  text-align: center;
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 10px;
  color: #111111;
  margin: 30px 0;
  border: 1px solid #e0e0e0;
`;

const getTemplate = (content) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="${baseStyle}">
        <div style="${headerStyle}">
          <a href="https://arsanthosh.com" style="${logoStyle}">Architect Santhosh</a>
        </div>
        <div style="${contentStyle}">
          ${content}
        </div>
        <div style="${footerStyle}">
          <p>© ${new Date().getFullYear()} Architect Santhosh. All rights reserved.</p>
          <p>Dine-in, Execution, and Premium Interior Design Solutions.</p>
          <div style="margin-top: 20px;">
            <a href="#" style="color: #c5a059; text-decoration: none; margin: 0 10px;">Instagram</a>
            <a href="#" style="color: #c5a059; text-decoration: none; margin: 0 10px;">Facebook</a>
            <a href="#" style="color: #c5a059; text-decoration: none; margin: 0 10px;">Twitter</a>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

module.exports = {
  otpTemplate: (otp) => getTemplate(`
    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #111111; text-align: center;">Verify Your Account</h1>
    <p>Dear Valued Client,</p>
    <p>Thank you for choosing <strong>Architect Santhosh</strong>. To proceed with your request, please use the following verification code:</p>
    <div style="${otpBoxStyle}">${otp}</div>
    <p>This code is valid for <strong>10 minutes</strong>. If you did not request this verification, please contact our support team immediately.</p>
    <p>Best regards,<br>The Architect Santhosh Team</p>
  `),

  orderConfirmationTemplate: (orderData) => getTemplate(`
    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #111111; text-align: center;">Order Approved & Confirmed</h1>
    <p>Hello <strong>${orderData.customerName}</strong>,</p>
    <p>Good news! Your order <strong>#${orderData.orderId}</strong> has been approved and is now being prepared for shipping.</p>
    
    <div style="margin: 25px 0; padding: 20px; background-color: #fcfcfc; border: 1px solid #eeeeee;">
      <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #999999; letter-spacing: 1px;">Tracking Information</h3>
      <p style="font-size: 18px; font-weight: bold; color: #111111; margin: 5px 0;">${orderData.trackingNumber || 'Processing'}</p>
      <p style="font-size: 11px; color: #666666; margin: 0;">Use this tracking number to monitor your delivery status on our portal.</p>
    </div>

    <div style="margin: 30px 0; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden;">
      <div style="background-color: #f9f9f9; padding: 15px 20px; font-weight: bold; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between;">
        <span>Order Summary</span>
        <span style="font-weight: normal; font-size: 12px; color: #666666;">Placed on ${new Date(orderData.createdAt).toLocaleDateString()}</span>
      </div>
      <div style="padding: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          ${orderData.items.map(item => `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                <div style="font-weight: bold;">${item.name}</div>
                <div style="font-size: 11px; color: #888;">Qty: ${item.quantity}</div>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">₹${item.price.toLocaleString()}</td>
            </tr>
          `).join('')}
          <tr>
            <td style="padding: 20px 0 5px 0; font-weight: bold;">Grand Total</td>
            <td style="padding: 20px 0 5px 0; font-weight: bold; text-align: right; color: #c5a059; font-size: 18px;">₹${orderData.totalAmount.toLocaleString()}</td>
          </tr>
        </table>
      </div>
    </div>

    <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin: 30px 0;">
      <div style="padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
        <h4 style="margin-top: 0; font-size: 11px; text-transform: uppercase; color: #999999;">Shipping Address</h4>
        <p style="font-size: 12px; margin: 5px 0; color: #333; line-height: 1.4;">${orderData.address}</p>
      </div>
      <div style="padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
        <h4 style="margin-top: 0; font-size: 11px; text-transform: uppercase; color: #999999;">Payment Method</h4>
        <p style="font-size: 12px; margin: 5px 0; color: #333;">${orderData.paymentMethod} (${orderData.paymentStatus})</p>
      </div>
    </div>

    <div style="border-top: 1px solid #eeeeee; padding-top: 20px; margin-top: 30px;">
      <h4 style="margin-top: 0; font-size: 11px; text-transform: uppercase; color: #999999;">Company Details</h4>
      <p style="font-size: 12px; margin: 5px 0; color: #333;"><strong>Architect Santhosh Studio</strong></p>
      <p style="font-size: 11px; margin: 2px 0; color: #666;">No. 123 Design Avenue, Premium Hub, Bangalore, India</p>
      <p style="font-size: 11px; margin: 2px 0; color: #666;">Phone: +91 98765 43210 | Email: office@arsanthosh.com</p>
    </div>

    <p style="text-align: center; margin-top: 30px;">
      <a href="https://arsanthosh.com/orders/${orderData.orderId}" style="${buttonStyle}">Track My Order</a>
    </p>

    <p>If you have any questions, please reply to this email or call our support line.</p>
    <p>Thank you for choosing Architect Santhosh Studio.</p>
  `),

  welcomeTemplate: (userName) => getTemplate(`
    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #111111; text-align: center;">Welcome to Architect Santhosh</h1>
    <p>Dear <strong>${userName}</strong>,</p>
    <p>We are thrilled to welcome you to the <strong>Architect Santhosh</strong> community. Your account has been successfully verified and is now active.</p>
    <p>At Architect Santhosh, we believe every space has a story to tell. Whether you're looking for curated products, bespoke interior execution, or premium design consultations, we are here to bring your vision to life.</p>
    
    <div style="margin: 30px 0; background-color: #f9f9f9; padding: 25px; border-left: 4px solid #c5a059;">
      <p style="margin: 0; font-weight: bold;">What's Next?</p>
      <ul style="margin: 15px 0 0 0; padding-left: 20px;">
        <li>Explore our premium interior products in the shop.</li>
        <li>Book a consultation with our design experts.</li>
        <li>Follow our latest projects for inspiration.</li>
      </ul>
    </div>

    <p style="text-align: center;">
      <a href="https://arsanthosh.com/products" style="${buttonStyle}">Start Exploring</a>
    </p>

    <p>Thank you for choosing us to be part of your design journey.</p>
    <p>Best regards,<br>The Architect Santhosh Team</p>
  `),

  adminCredentialsTemplate: (name, email, password) => getTemplate(`
    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #111111; text-align: center;">Administrative Onboarding</h1>
    <p>Hello <strong>${name}</strong>,</p>
    <p>A new administrative account has been created for you at <strong>Architect Santhosh</strong> by the Super Admin.</p>
    
    <div style="margin: 30px 0; background-color: #f9f9f9; padding: 25px; border: 1px solid #eeeeee; border-radius: 4px;">
      <h4 style="margin-top: 0; font-size: 11px; text-transform: uppercase; color: #999999; letter-spacing: 1px;">Access Credentials</h4>
      <p style="font-size: 14px; margin: 10px 0; color: #333;"><strong>Email:</strong> ${email}</p>
      <p style="font-size: 14px; margin: 10px 0; color: #333;"><strong>Temporary Password:</strong> <span style="font-family: monospace; background: #eee; padding: 2px 6px;">${password}</span></p>
    </div>

    <p style="font-weight: bold; color: #111111;">Mandatory Security Steps:</p>
    <ol style="color: #666; font-size: 13px; line-height: 1.8;">
      <li>Login using the credentials above.</li>
      <li>You will be immediately prompted to <strong>update your password</strong>.</li>
      <li>Upon updating, you will receive your <strong>12-digit Security Secret Key</strong>.</li>
    </ol>

    <div style="background-color: #fff9e6; border: 1px solid #ffe699; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 11px; font-weight: bold; color: #856404; text-transform: uppercase;">Security Alert</p>
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #856404;">This link and temporary password will expire soon. Please complete your onboarding within 24 hours.</p>
    </div>

    <p style="text-align: center; margin-top: 30px;">
      <a href="https://arsanthosh.com/ars-management-portal" style="${buttonStyle}">Access Admin Portal</a>
    </p>

    <p>If you did not expect these credentials, please report this to the Security Team immediately.</p>
    <p>Best regards,<br>The Architect Santhosh Team</p>
  `),
};
