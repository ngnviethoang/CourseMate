import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4100';

const oAuthConfig = {
    issuer: 'https://localhost:44393/',
    redirectUri: baseUrl,
    clientId: 'CourseMate_ClientWeb',
    responseType: 'code',
    scope: 'offline_access CourseMate',
    requireHttps: true
};
export const environment = {
    production: false,
    application: {
        baseUrl,
        name: 'CourseMate'
    },
    oAuthConfig,
    apis: {
        default: {
            url: 'https://localhost:44393',
            rootNamespace: 'CourseMate'
        },
        AbpAccountPublic: {
            url: oAuthConfig.issuer,
            rootNamespace: 'AbpAccountPublic'
        }
    },
    hubs: {
        notification: 'https://localhost:44380/signalr-hubs/notification/'
    },
    baseUrl: 'https://localhost:44319/api/v1/',
    urlUploadFile: 'https://localhost:44349/api/v1/',
    clientIdGoogle: '',
    facebookId: '',
    baseUrlHub: 'https://localhost:44319/',
    stripePublicKey: 'pk_test_51N6HwWLcCqr269TdVni7gwhS4QTPyR4UilZqxouP3KjAIRuPx66on5f97oraQ9zY3wFrzfuJKgc3s3eLzAaihKtb00K8D1MLh8'
} as Environment;
