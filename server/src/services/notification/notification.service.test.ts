/**
 * Unit tests for NotificationService.
 * Provider interfaces are mocked — no real Resend or 360dialog calls.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationService } from './notification.service.js';
import { IEmailProvider, IWhatsAppProvider } from './types.js';
import { ConfigurationError } from '../../config/index.js';

// Mock providers
function createMockEmailProvider(): IEmailProvider {
  return {
    sendEmail: vi.fn().mockResolvedValue(undefined),
  };
}

function createMockWhatsAppProvider(): IWhatsAppProvider {
  return {
    sendWhatsApp: vi.fn().mockResolvedValue(undefined),
  };
}

describe('NotificationService', () => {
  let emailProvider: IEmailProvider;
  let whatsappProvider: IWhatsAppProvider;
  let service: NotificationService;

  beforeEach(() => {
    emailProvider = createMockEmailProvider();
    whatsappProvider = createMockWhatsAppProvider();
    service = new NotificationService(emailProvider, whatsappProvider);
  });

  describe('send() with email channel', () => {
    it('calls emailProvider.sendEmail with correct args', async () => {
      await service.send({
        channel: 'email',
        to: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test body',
      });

      expect(emailProvider.sendEmail).toHaveBeenCalledOnce();
      expect(emailProvider.sendEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Test Subject',
        'Test body'
      );
      expect(whatsappProvider.sendWhatsApp).not.toHaveBeenCalled();
    });

    it('uses "(no subject)" when subject is omitted', async () => {
      await service.send({
        channel: 'email',
        to: 'test@example.com',
        body: 'Body only',
      });

      expect(emailProvider.sendEmail).toHaveBeenCalledWith(
        'test@example.com',
        '(no subject)',
        'Body only'
      );
    });

    it('propagates errors from emailProvider', async () => {
      vi.mocked(emailProvider.sendEmail).mockRejectedValueOnce(
        new Error('Resend API error')
      );

      await expect(
        service.send({ channel: 'email', to: 'x@x.com', body: 'body' })
      ).rejects.toThrow('Resend API error');
    });
  });

  describe('send() with whatsapp channel', () => {
    it('calls whatsappProvider.sendWhatsApp with correct args', async () => {
      await service.send({
        channel: 'whatsapp',
        to: '+15551234567',
        body: 'Hello from AAUClubManager',
      });

      expect(whatsappProvider.sendWhatsApp).toHaveBeenCalledOnce();
      expect(whatsappProvider.sendWhatsApp).toHaveBeenCalledWith(
        '+15551234567',
        'Hello from AAUClubManager'
      );
      expect(emailProvider.sendEmail).not.toHaveBeenCalled();
    });

    it('propagates errors from whatsappProvider', async () => {
      vi.mocked(whatsappProvider.sendWhatsApp).mockRejectedValueOnce(
        new Error('360dialog API error')
      );

      await expect(
        service.send({ channel: 'whatsapp', to: '+1555', body: 'msg' })
      ).rejects.toThrow('360dialog API error');
    });
  });

  describe('provider instantiation errors', () => {
    it('ResendEmailProvider throws ConfigurationError when RESEND_API_KEY is missing', async () => {
      // Save and clear env var
      const original = process.env['RESEND_API_KEY'];
      delete process.env['RESEND_API_KEY'];

      // Reset config module to pick up missing env var
      const { ResendEmailProvider } = await import('./providers/resend.email.js');

      expect(() => new ResendEmailProvider()).toThrow(ConfigurationError);

      // Restore
      if (original) process.env['RESEND_API_KEY'] = original;
    });

    it('Dialog360WhatsAppProvider throws ConfigurationError when DIALOG360_API_KEY is missing', async () => {
      const original = process.env['DIALOG360_API_KEY'];
      delete process.env['DIALOG360_API_KEY'];

      const { Dialog360WhatsAppProvider } = await import('./providers/dialog360.whatsapp.js');

      expect(() => new Dialog360WhatsAppProvider()).toThrow(ConfigurationError);

      if (original) process.env['DIALOG360_API_KEY'] = original;
    });
  });
});
