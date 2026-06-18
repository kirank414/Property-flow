import { logger } from './logger';

export class EmailService {
  /**
   * Mock email dispatcher
   */
  async sendEmail(toEmail: string, subject: string, body: string): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    logger.info({
      message: `✉️ OUTBOUND EMAIL SENT SUCCESSFULLY`,
      to: toEmail,
      subject,
      bodySnippet: body.substring(0, 100),
    });

    return true;
  }
}

export const emailService = new EmailService();
export default emailService;
