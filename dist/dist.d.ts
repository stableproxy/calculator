export default Calculator;
export type PackageOrderConstructor = {
    id: number | null;
    count?: number | undefined;
    traffic_amount?: number | undefined;
    traffic_unit?: string | undefined;
    period_amount?: number | undefined;
    period_unit?: string | undefined;
    countries?: Record<string, number> | undefined;
    currency?: string | undefined;
    added_price_per_day?: number | undefined;
    type?: string | undefined;
    has_unlimited_auth_ips?: boolean | undefined;
    user_id?: number | undefined;
    already_spent_in_usd?: number | undefined;
    version?: number | undefined;
    isRenew?: number | undefined;
    ipScore?: number | undefined;
    service?: string | null | undefined;
    bonuses?: Record<string, number> | undefined;
};
declare class Calculator {
    /**
     * @callback userIdFetch
     * @returns {number}
     */
    constructor(userIdFetch?: () => number, salePercentageFetch?: () => number, localeFetch?: () => string);
    currencyRates: CurrencyRates;
    lang: Lang;
    userIdFetch: () => number;
    salePercentageFetch: () => number;
    localeFetch: () => string;
    getLocale(): string;
    phase(key: any, args?: any[], locale?: string): any;
    getSalePercentage(): number;
    getUserId(): number;
    isLogged(): boolean;
    /**
     * @param {CalculatorInput} options
     * @returns {CalculatorOutput}
     */
    calculate(options: CalculatorInput): CalculatorOutput;
}
export class CalculatorInput {
    constructor(Wd3f5edb97_b976_a6f7c?: string, ude483a2af_2afe_62036?: number, Se40443e3f_e3fa_c738c?: number, Ed1462699d_99d6_bfbf4?: boolean, k882124820_8203_98d56?: number, G00a595152_1525_d2cf4?: string, p20c205e33_e337_3e81e?: boolean, f586215647_6472_c38d1?: number, w341ee2a2c_a2c3_d95b7?: number, Fbb4ce3280_2803_e64ad?: number, r577b9ed7e_d7ed_adac9?: number, t5c9e6f994_9947_17340?: number, P780bb5cc7_cc77_e7ee9?: any, p8c6882226_2260_4c979?: any[], ra57bb1a97_a974_46cf2?: {});
    Wd3f5edb97_b976_a6f7c: any;
    ude483a2af_2afe_62036: any;
    Se40443e3f_e3fa_c738c: any;
    Ed1462699d_99d6_bfbf4: any;
    k882124820_8203_98d56: any;
    G00a595152_1525_d2cf4: any;
    p20c205e33_e337_3e81e: any;
    f586215647_6472_c38d1: any;
    w341ee2a2c_a2c3_d95b7: any;
    Fbb4ce3280_2803_e64ad: any;
    r577b9ed7e_d7ed_adac9: any;
    t5c9e6f994_9947_17340: any;
    P780bb5cc7_cc77_e7ee9: any;
    p8c6882226_2260_4c979: any;
    ra57bb1a97_a974_46cf2: any;
}
export class CurrencyRates {
    constructor(rates?: {
        EUR: number;
        GBP: number;
        UAH: number;
        USD: number;
        PLN: number;
    });
    rates: {
        EUR: number;
        GBP: number;
        UAH: number;
        USD: number;
        PLN: number;
    };
    get(currency: any): any;
    format(value: any, currency: any): string;
}
export class CalculatorOutput {
    constructor(options: any);
    /** @type {number} */
    overall: number;
    /** @type {number} */
    oneProxy: number;
    /** @type {string} */
    overallFormatted: string;
    /** @type {string} */
    oneProxyFormatted: string;
    /** @type {number} */
    overallUSD: number;
    /** @type {number} */
    oneProxyUSD: number;
    /** @type {string} */
    overallFormattedUSD: string;
    /** @type {string} */
    oneProxyFormattedUSD: string;
    /** @type {number} */
    version: number;
    /** @type {string} */
    currency: string;
    /** @type {number} */
    salePercentage: number;
    /** @type {number} */
    saleAmountUSD: number;
    /** @type {number} */
    saleAmount: number;
    /** @type {Record<string, number>} */
    fees: Record<string, number>;
    /** @type {Record<string, number>} */
    bonuses: Record<string, number>;
    /** @type {number} */
    calc_at: number;
}
export class CalcUtils {
    /**
     * @param {*} value
     * @returns {boolean}
     */
    static is_empty(value: any): boolean;
    /**
     * @param {string | number} key
     * @param {Record<any, any>} array
     * @returns {boolean}
     */
    static array_key_exists(key: string | number, array: Record<any, any>): boolean;
    static is_numeric(value: any): boolean;
    static round(num: any, dec?: number): number;
    static convertStorageUnit(size: any, fromUnit: any, toUnit: any, linux?: boolean): any;
    static addMonthsDate(date: any, months: any): any;
    static convertTimeUnit(value: any, from: any, to: any): any;
}
/**
 * @typedef {Object} PackageOrderConstructor
 * @property {number | null} id
 * @property {number=} count
 * @property {number=} traffic_amount
 * @property {string=} traffic_unit
 * @property {number=} period_amount
 * @property {string=} period_unit
 * @property {Record<string, number>=} countries
 * @property {string=} currency
 * @property {number=} added_price_per_day
 * @property {string=} type
 * @property {boolean=} has_unlimited_auth_ips
 * @property {number=} user_id
 * @property {number=} already_spent_in_usd
 * @property {number=} version
 * @property {number=} isRenew
 * @property {number=} ipScore
 * @property {string | null | undefined} [service]
 * @property {Record<string, number>=} bonuses
 */
/**
 * @class
 */
export class PackageOrder {
    /**
     * @param {PackageOrderConstructor} [options={}]
     */
    constructor({ id, count, traffic_amount, traffic_unit, period_amount, period_unit, countries, currency, added_price_per_day, type, has_unlimited_auth_ips, user_id, already_spent_in_usd, version, isRenew, ipScore, service, bonuses }?: PackageOrderConstructor);
    /** @type {number | null} */
    id: number | null;
    /** @type {number} */
    count: number;
    /** @type {number} */
    traffic_amount: number;
    /** @type {string} */
    traffic_unit: string;
    /** @type {number} */
    period_amount: number;
    /** @type {string} */
    period_unit: string;
    /** @type {Record<string, number>} */
    countries: Record<string, number>;
    /** @type {string} */
    currency: string;
    /** @type {number} */
    added_price_per_day: number;
    /** @type {string} */
    type: string;
    /** @type {boolean} */
    has_unlimited_auth_ips: boolean;
    /** @type {number} */
    user_id: number;
    /** @type {number} */
    already_spent_in_usd: number;
    /** @type {number} */
    version: number;
    /** @type {number} */
    isRenew: number;
    /** @type {number} */
    ipScore: number;
    /** @type {string | null} */
    service: string | null;
    /** @type {Record<string, number>} */
    bonuses: Record<string, number>;
    /**
     * @returns {number}
     */
    get traffic_in_gb(): number;
    /**
     * @returns {boolean}
     */
    get pay_for_setup(): boolean;
    /**
     * @returns {number}
     */
    get period_days(): number;
    /**
     * @param {Calculator} calculator
     * @param {string} currency
     * @returns {CalculatorOutput}
     */
    getRenewPrices(calculator: Calculator, currency?: string, type?: number): CalculatorOutput;
    /**
     * @param {Calculator} calculator
     * @param {string} currency
     * @returns {CalculatorOutput}
     */
    getPrices(calculator: Calculator, currency?: string): CalculatorOutput;
}
declare class Lang {
    constructor(phases?: {
        "messages.landing.calculator.one-gb-price": {
            uk: string;
            en: string;
            pl: string;
            ru: string;
        };
        "messages.landing.calculator.oneproxyprice": {
            uk: string;
            en: string;
            pl: string;
            ru: string;
        };
    }, locale?: string);
    phases: {
        "messages.landing.calculator.one-gb-price": {
            uk: string;
            en: string;
            pl: string;
            ru: string;
        };
        "messages.landing.calculator.oneproxyprice": {
            uk: string;
            en: string;
            pl: string;
            ru: string;
        };
    };
    locale: string;
    get(key: any, args?: any[], locale?: string): any;
}
//# sourceMappingURL=dist.d.ts.map