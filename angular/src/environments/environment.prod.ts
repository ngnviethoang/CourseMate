import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44393/',
  redirectUri: baseUrl,
  clientId: 'CourseMate_App',
  responseType: 'code',
  scope: 'offline_access CourseMate',
  requireHttps: true,
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'CourseMate',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:44393',
      rootNamespace: 'CourseMate',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
} as Environment;
