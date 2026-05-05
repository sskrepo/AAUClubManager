/**
 * NotificationService — channel-agnostic notification dispatcher.
 *
 * Dispatches to the correct provider based on payload.channel.
 * Callers never import Resend or 360dialog directly — they call send() here.
 *
 * DI: providers are injected (or defaulted from env-configured instances).
 * This makes the service testable without real credentials.
 */

import { NotificationPayload, IEmailProvider, IWhatsAppProvider, Channel } from './types.js';
import { logger } from '../../lib/logger.js';

export class NotificationService {
  private readonly emailProvider: IEmailProvider;
  private readonly whatsappProvider: IWhatsAppProvider;

  constructor(emailProvider: IEmailProvider, whatsappProvider: IWhatsAppProvider) {
    this.emailProvider = emailProvider;
    this.whatsappProvider = whatsappProvider;
  }

  async send(payload: NotificationPayload): Promise<void> {
    logger.info({ channel: payload.channel, to: payload.to }, 'NotificationService.send');

    switch (payload.channel) {
      case Channel.email: {
        const subject = payload.subject ?? '(no subject)';
        await this.emailProvider.sendEmail(payload.to, subject, payload.body);
        break;
      }

      case Channel.whatsapp: {
        await this.whatsappProvider.sendWhatsApp(payload.to, payload.body);
        break;
      }

      default: {
        const exhaustiveCheck: never = payload.channel;
        throw new Error(`Unknown notification channel: ${String(exhaustiveCheck)}`);
      }
    }
  }
}

/**
 * Factory: creates a NotificationService with real providers from env.
 * Throws ConfigurationError at instantiation if credentials are missing.
 * Call this in workers and scripts, not in unit tests (mock instead).
 */
export function createNotificationService(): NotificationService {
  // Dynamic imports to avoid requiring credentials at module load time in tests
  const { ResendEmailProvider } = require('./providers/resend.email.js') as {
    ResendEmailProvider: new () => IEmailProvider;
  };
  const { Dialog360WhatsAppProvider } = require('./providers/dialog360.whatsapp.js') as {
    Dialog360WhatsAppProvider: new () => IWhatsAppProvider;
  };

  return new NotificationService(
    new ResendEmailProvider(),
    new Dialog360WhatsAppProvider()
  );
}
