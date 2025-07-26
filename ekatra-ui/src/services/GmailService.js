import GoogleAuthService from './GoogleAuthService';

class GmailService {
  constructor() {
    this.baseUrl = 'https://gmail.googleapis.com/gmail/v1';
  }

  // Send email
  async sendEmail(to, subject, body, attachments = []) {
    try {
      const message = this.createMessage(to, subject, body, attachments);
      
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/users/me/messages/send`,
        {
          method: 'POST',
          body: JSON.stringify({
            raw: message
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to send email');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Create email message in base64 format
  createMessage(to, subject, body, attachments = []) {
    const boundary = '===BOUNDARY===';
    let message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      '',
      body,
      ''
    ];

    // Add attachments if any
    attachments.forEach(attachment => {
      message.push(`--${boundary}`);
      message.push(`Content-Type: ${attachment.mimeType}`);
      message.push(`Content-Disposition: attachment; filename="${attachment.filename}"`);
      message.push('Content-Transfer-Encoding: base64');
      message.push('');
      message.push(attachment.data);
      message.push('');
    });

    message.push(`--${boundary}--`);
    
    return btoa(message.join('\n'))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // Get email templates
  getEmailTemplates() {
    return {
      progress_report: {
        subject: 'Progress Report for {studentName}',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Progress Report</h2>
            <p>Dear Parent,</p>
            <p>I hope this email finds you well. I'm writing to update you on <strong>{studentName}</strong>'s progress in my class.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Performance Summary</h3>
              <ul style="line-height: 1.6;">
                <li><strong>Current Grade:</strong> {grade}</li>
                <li><strong>Areas of Strength:</strong> {strengths}</li>
                <li><strong>Areas for Improvement:</strong> {improvements}</li>
              </ul>
            </div>
            
            <p>{customMessage}</p>
            
            <p>Please feel free to reach out if you have any questions or would like to schedule a meeting.</p>
            
            <p>Best regards,<br>
            {teacherName}<br>
            {teacherEmail}</p>
          </div>
        `
      },
      general_inquiry: {
        subject: 'Message from {teacherName}',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Message from Your Child's Teacher</h2>
            <p>Dear Parent,</p>
            <p>{customMessage}</p>
            
            <p>Please don't hesitate to contact me if you have any questions.</p>
            
            <p>Best regards,<br>
            {teacherName}<br>
            {teacherEmail}</p>
          </div>
        `
      },
      meeting_request: {
        subject: 'Meeting Request - {studentName}',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Meeting Request</h2>
            <p>Dear Parent,</p>
            <p>I would like to schedule a meeting to discuss <strong>{studentName}</strong>'s progress and development.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Meeting Details</h3>
              <ul style="line-height: 1.6;">
                <li><strong>Purpose:</strong> {meetingPurpose}</li>
                <li><strong>Suggested Time:</strong> {suggestedTime}</li>
                <li><strong>Duration:</strong> {duration}</li>
                <li><strong>Format:</strong> {format}</li>
              </ul>
            </div>
            
            <p>{customMessage}</p>
            
            <p>Please reply with your availability or suggest alternative times.</p>
            
            <p>Best regards,<br>
            {teacherName}<br>
            {teacherEmail}</p>
          </div>
        `
      }
    };
  }

  // Format email with template
  formatEmail(template, variables) {
    const templates = this.getEmailTemplates();
    const emailTemplate = templates[template];
    
    if (!emailTemplate) {
      throw new Error(`Email template '${template}' not found`);
    }

    let subject = emailTemplate.subject;
    let body = emailTemplate.body;

    // Replace variables in subject and body
    Object.keys(variables).forEach(key => {
      const placeholder = `{${key}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), variables[key] || '');
      body = body.replace(new RegExp(placeholder, 'g'), variables[key] || '');
    });

    return { subject, body };
  }

  // Get sent emails
  async getSentEmails(query = '', maxResults = 50) {
    try {
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get emails');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting sent emails:', error);
      throw error;
    }
  }

  // Get email details
  async getEmailDetails(messageId) {
    try {
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/users/me/messages/${messageId}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get email details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting email details:', error);
      throw error;
    }
  }
}

export default new GmailService();