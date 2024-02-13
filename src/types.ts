export type СurrencyBackendType = {
    SECID: string;
    BOARDID: string;
    SHORTNAME: string;
    LOTSIZE: number;
    SETTLEDATE: string;
    DECIMALS: number;
    FACEVALUE: number;
    MARKETCODE: string;
    MINSTEP: number;
    PREVDATE: string;
    SECNAME: string;
    REMARKS: any;
    STATUS: string;
    FACEUNIT: string;
    PREVPRICE: number;
    PREVWAPRICE: number;
    CURRENCYID: string;
    LATNAME: string;
    LOTDIVIDER: number;
    LAST: number;
};

export type СurrencyType = {
    text: string;
    value: number;
};
