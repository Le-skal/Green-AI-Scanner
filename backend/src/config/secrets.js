import { InfisicalClient } from '@infisical/sdk';

/**
 * Loads secrets from Infisical (eu.infisical.com) into process.env.
 * Falls back silently to local .env variables if Infisical is unavailable.
 */
export const loadSecrets = async () => {
  const token = process.env.INFISICAL_TOKEN;

  if (!token) {
    console.log('[Secrets] INFISICAL_TOKEN not set - using local .env fallback');
    return;
  }

  try {
    console.log('[Secrets] Connecting to Infisical (eu.infisical.com)...');

    const client = new InfisicalClient({
      siteUrl: 'https://eu.infisical.com',
      auth: {
        serviceToken: token,
      },
    });

    const secrets = await client.listSecrets({
      environment: 'dev',
      path: '/',
    });

    let count = 0;
    for (const { secretKey, secretValue } of secrets) {
      // Only set if not already defined locally (local .env takes precedence)
      if (!process.env[secretKey]) {
        process.env[secretKey] = secretValue;
        count++;
      }
    }

    console.log(`[Secrets] ${count} secrets loaded from Infisical`);
  } catch (err) {
    console.warn(`[Secrets] Could not reach Infisical: ${err.message}`);
    console.warn('[Secrets] Falling back to local .env variables');
  }
};
