/**
 * Notification service types and interfaces.
 * Provider implementations must satisfy these interfaces.
 */

export const Channel = {
  email: 'email',
  whatsapp: 'whatsapp',
} as const;

export type Channel = (typeof Channel)[keyof typeof Channel];

export interface NotificationPayload {
  channel: Channel;
  to: string;
  subject?: string; // email only
  body: string;
}

/**
 * Email provider interface.
 * Swap the email provider by creating a new class that implements this.
 */
export interface IEmailProvider {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

/**
 * WhatsApp provider interface.
 * Swap the WhatsApp BSP by creating a new class that implements this.
 * No callsite or service-layer changes required.
 */
export interface IWhatsAppProvider {
  sendWhatsApp(to: string, body: string): Promise<void>;
}
