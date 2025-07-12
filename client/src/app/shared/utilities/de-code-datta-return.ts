export class DecodeDataReturn {
    decodeDataReturn(dataReturn: string) {
        const dataDecode = Buffer.from(dataReturn, 'base64').toString('utf-8');
        const returnData = JSON.parse(dataDecode);
        return returnData;

    }

}
