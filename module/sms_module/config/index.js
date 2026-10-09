export const smsModuleConfig = {
  provider: process.env.TWO_FACTOR_PROVIDER || '2factor',
  baseUrl: process.env.TWO_FACTOR_BASE_URL || 'https://2factor.in',
};
