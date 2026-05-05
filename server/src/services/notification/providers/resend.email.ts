/**
 * Resend email provider implementation.
 * Implements IEmailProvider using the Resend SDK.
 *
 * Required env vars:
 *   RESEND_API_KEY    — Resend API key
 *   RESEND_FROM_EMAIL — Sender email address (must be verified in Resend dashboard)
 */

import { Resend } from 'resend';
import { IEmailProvider } from '../types.js';
import { config } from '../../../config/index.js';
import { ConfigurationError } from '../../../config/index.js';
import { logger } from '../../../lib/logger.js';

export class ResendEmailProvider implements IEmailProvider {
  private readonly client: Resend;
  private readonly fromEmail: string;

  constructor() {
    const apiKey = config.resendApiKey;
    if (!apiKey) {
      throw new ConfigurationError(
        'ResendEmailProvider requires RESEND_API_KEY to be set.'
      );
    }

    const fromEmail = config.resendFromEmail;
    if (!fromEmail) {
      throw new ConfigurationError(
        'ResendEmailProvider requires RESEND_FROM_EMAIL to be set.'
      );
    }

    this.client = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    logger.info({ to, subject }, 'Sending email via Resend');

    const { error } = await this.client.emails.send({
      from: this.fromEmail,
      to,
      subject,
      text: body,
    });

    if (error) {
      logger.error({ error, to, subject }, 'Resend email send failed');
      throw new Error(`Resend email send failed: ${error.message}`);
    }

    logger.info({ to, subject }, 'Email sent successfully via Resend');
  }
}
