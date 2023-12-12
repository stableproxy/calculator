export default Calculator;
declare class Calculator {
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
    constructor(currencyOrOptions?: string, proxyCount?: number, daysCount?: number, isRandomProxy?: boolean, addedUSDToPerDay?: number, proxyFor?: string, hasUnlimitedIps?: boolean, version?: number, trafficInGb?: number, ownerId?: number);
    currency: any;
    proxyCount: any;
    daysCount: any;
    isRandomProxy: any;
    addedUSDToPerDay: any;
    proxyFor: any;
    hasUnlimitedIps: any;
    version: any;
    trafficInGb: any;
    ownerId: any;
}
export class CurrencyRates {
    constructor(rates?: {
        EUR: number;
        GBP: number;
        UAH: number;
        USD: number;
    });
    rates: {
        EUR: number;
        GBP: number;
        UAH: number;
        USD: number;
    };
    get(currency: any): any;
    format(value: any, currency: any): string;
}
/**
 * @property {number} overall
 * @property {number} oneProxy
 * @property {string} overallFormatted
 * @property {string} oneProxyFormatted
 * @property {number} overallUSD
 * @property {number} oneProxyUSD
 * @property {string} overallFormattedUSD
 * @property {string} oneProxyFormattedUSD
 * @property {number} version
 * @property {string} currency
 * @property {number} salePercentage
 * @property {number} saleAmountUSD
 * @property {number} saleAmount
 */
export class CalculatorOutput {
    constructor(options: any);
    overall: any;
    oneProxy: any;
    overallFormatted: any;
    oneProxyFormatted: any;
    overallUSD: any;
    oneProxyUSD: any;
    overallFormattedUSD: any;
    oneProxyFormattedUSD: any;
    version: any;
    currency: any;
    salePercentage: any;
    saleAmountUSD: any;
    saleAmount: any;
}
export class CalcUtils {
    static is_numeric(value: any): boolean;
    static round(num: any, dec?: number): number;
    static convertStorageUnit(size: any, fromUnit: any, toUnit: any, linux?: boolean): any;
    static addMonthsDate(date: any, months: any): any;
    static convertTimeUnit(value: any, from: any, to: any): any;
}
/**
 * @class
 */
export class PackageOrder {
    /**
     * @param {PackageOrder} [options={}]
     */
    constructor({ id, count, traffic_amount, traffic_unit, period_amount, period_unit, countries, currency, added_price_per_day, type, has_unlimited_auth_ips, user_id, already_spent_in_usd, version }?: PackageOrder);
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
    getRenewPrices(calculator: Calculator, currency?: string): CalculatorOutput;
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
            ru: string;
        };
        "messages.landing.calculator.oneproxyprice": {
            uk: string;
            en: string;
            ru: string;
        };
    }, locale?: string);
    phases: {
        "messages.landing.calculator.one-gb-price": {
            uk: string;
            en: string;
            ru: string;
        };
        "messages.landing.calculator.oneproxyprice": {
            uk: string;
            en: string;
            ru: string;
        };
    };
    locale: string;
    get(key: any, args?: any[], locale?: string): any;
}
//# sourceMappingURL=dist.d.ts.map