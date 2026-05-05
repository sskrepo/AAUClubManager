/**
 * Config module — single place all env vars are read.
 * Throws ConfigurationError at startup if required vars are absent.
 * Never read process.env outside this file.
 */

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

function optional(name: string, defaultValue?: string): string | undefined {
  return process.env[name] ?? defaultValue;
}

function optionalInt(name: string, defaultValue: number): number {
  const raw = process.env[name];
  if (!raw) return defaultValue;
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) {
    throw new ConfigurationError(
      `Environment variable ${name} must be an integer, got: ${raw}`
    );
  }
  return parsed;
}

export const config = {
  nodeEnv: optional('NODE_ENV', 'development') as 'development' | 'production' | 'test',
  port: optionalInt('PORT', 3001),

  // Database — optional for unit tests (no DB available); required in dev/prod
  databaseUrl: optional('DATABASE_URL'),

  // Redis — optional for unit tests
  redisUrl: optional('REDIS_URL', 'redis://localhost:6379'),

  // Clerk — required for auth middleware to function
  clerkSecretKey: optional('CLERK_SECRET_KEY'),
  clerkJwksUrl: optional('CLERK_JWKS_URL'),

  // Resend — required for email notifications
  resendApiKey: optional('RESEND_API_KEY'),
  resendFromEmail: optional('RESEND_FROM_EMAIL', 'noreply@localhost'),

  // 360dialog WhatsApp
  dialog360ApiKey: optional('DIALOG360_API_KEY'),
  dialog360BaseUrl: optional('DIALOG360_BASE_URL', 'https://waba-sandbox.360dialog.io/v1'),
  dialog360WhatsappFrom: optional('DIALOG360_WHATSAPP_FROM'),

  // Test targets (dev scripts only)
  testEmail: optional('TEST_EMAIL'),
  testWhatsappNumber: optional('TEST_WHATSAPP_NUMBER'),

  // Build version
  version: optional('npm_package_version', '0.1.0') ?? '0.1.0',
} as const;

/**
 * Validate that required credentials are present for a given feature.
 * Call at service instantiation time, not at startup, so unit tests
 * can boot without all credentials set.
 */
export function requireEnv(name: keyof typeof config, feature: string): string {
  const value = config[name] as string | undefined;
  if (!value) {
    throw new ConfigurationError(
      `${feature} requires ${name.toUpperCase().replace(/([A-Z])/g, '_$1').toUpperCase()} to be set.`
    );
  }
  return value;
}
