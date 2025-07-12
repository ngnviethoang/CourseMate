import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
    issuer: 'https://localhost:44393/',
    redirectUri: baseUrl,
    clientId: 'CourseMate_App',
    responseType: 'code',
    scope: 'offline_access CourseMate',
    requireHttps: true
};

export const environment = {
    production: true,
    application: {
        baseUrl,
        name: '44393'
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
    remoteEnv: {
        url: '/getEnvConfig',
        mergeStrategy: 'deepmerge'
    },
    hubs: {
        notification: 'https://localhost:44380/signalr-hubs/notification/'
    },
    baseUrl: 'https://hdnxapi.devproinsights.com/api/v1/',
    urlUploadFile: 'https://hdnxvideo.devproinsights.com/api/v1/',
    clientIdGoogle: '458553878162-a7m0q6jreoirc837m3dp06mtmv5t5cu7.apps.googleusercontent.com',
    facebookId: '727016849494944',
    baseUrlHub: 'https://hdnxapi.devproinsights.com/',
    stripePublicKey: 'pk_test_51N6HwWLcCqr269TdVni7gwhS4QTPyR4UilZqxouP3KjAIRuPx66on5f97oraQ9zY3wFrzfuJKgc3s3eLzAaihKtb00K8D1MLh8'
} as Environment;
