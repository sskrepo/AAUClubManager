/**
 * 360dialog WhatsApp Business API provider implementation.
 * Implements IWhatsAppProvider using the 360dialog REST API directly.
 *
 * Required env vars:
 *   DIALOG360_API_KEY     — 360dialog API key (D360-API-KEY header)
 *   DIALOG360_BASE_URL    — Base URL (sandbox: https://waba-sandbox.360dialog.io/v1)
 *                           Production: https://waba-v2.360dialog.io/v2
 *   DIALOG360_WHATSAPP_FROM — WhatsApp phone number (required for production; optional for sandbox)
 *
 * Sandbox limits (Phase 0 dev):
 *   - 200 message cap total
 *   - Can only send to your own WhatsApp number
 *   - 3 predefined templates: disclaimer, first_welcome_messsage, interactive_template_sandbox
 *
 * Note: Base URL is env-driven so dev hits sandbox and prod hits production with no code change.
 * See ADR-003 and DECISION-002-B.
 */

import { IWhatsAppProvider } from '../types.js';
import { config } from '../../../config/index.js';
import { ConfigurationError } from '../../../config/index.js';
import { logger } from '../../../lib/logger.js';

interface Dialog360MessageBody {
  messaging_product: string;
  to: string;
  type: string;
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
  };
}

export class Dialog360WhatsAppProvider implements IWhatsAppProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    const apiKey = config.dialog360ApiKey;
    if (!apiKey) {
      throw new ConfigurationError(
        'Dialog360WhatsAppProvider requires DIALOG360_API_KEY to be set.'
      );
    }

    const baseUrl = config.dialog360BaseUrl;
    if (!baseUrl) {
      throw new ConfigurationError(
        'Dialog360WhatsAppProvider requires DIALOG360_BASE_URL to be set.'
      );
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, ''); // strip trailing slash
  }

  async sendWhatsApp(to: string, body: string): Promise<void> {
    logger.info({ to, baseUrl: this.baseUrl }, 'Sending WhatsApp via 360dialog');

    const endpoint = `${this.baseUrl}/messages`;

    const messageBody: Dialog360MessageBody = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'D360-API-KEY': this.apiKey,
      },
      body: JSON.stringify(messageBody),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'unknown error');
      logger.error(
        { to, status: response.status, error: errorText, baseUrl: this.baseUrl },
        '360dialog WhatsApp send failed'
      );
      throw new Error(
        `360dialog WhatsApp send failed: HTTP ${response.status} — ${errorText}`
      );
    }

    const responseData = (await response.json()) as Record<string, unknown>;
    logger.info({ to, messageId: responseData['messages'] }, 'WhatsApp sent via 360dialog');
  }
}
