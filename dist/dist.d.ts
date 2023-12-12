export default Calculator;
declare class Calculator {
    constructor(userIdFetch?: () => number, salePercentageFetch?: () => any, localeFetch?: () => any);
    currencyRates: CurrencyRates;
    lang: Lang;
    userIdFetch: () => number;
    salePercentageFetch: () => any;
    localeFetch: () => any;
    getLocale(): any;
    phase(key: any, args?: any[], locale?: any): any;
    getSalePercentage(): any;
    getUserId(): number;
    isLogged(): boolean;
    /**
     * @param {CalculatorInput} options
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
export class CalcUtils {
    static is_numeric(value: any): boolean;
    static round(num: any, dec?: number): number;
    static convertStorageUnit(size: any, fromUnit: any, toUnit: any, linux?: boolean): any;
    static addMonthsDate(date: any, months: any): any;
    static convertTimeUnit(value: any, from: any, to: any): any;
}
export class PackageOrder {
    constructor({ id, count, traffic_amount, traffic_unit, period_amount, period_unit, countries, currency, added_price_per_day, type, has_unlimited_auth_ips, user_id, already_spent_in_usd, version }?: {
        id: any;
        count: any;
        traffic_amount: any;
        traffic_unit: any;
        period_amount: any;
        period_unit: any;
        countries: any;
        currency: any;
        added_price_per_day: any;
        type: any;
        has_unlimited_auth_ips: any;
        user_id: any;
        already_spent_in_usd: any;
        version: any;
    });
    id: any;
    count: any;
    traffic_amount: any;
    traffic_unit: any;
    period_amount: any;
    period_unit: any;
    countries: any;
    currency: any;
    added_price_per_day: any;
    type: any;
    has_unlimited_auth_ips: any;
    user_id: any;
    already_spent_in_usd: any;
    version: any;
    get traffic_in_gb(): any;
    get pay_for_setup(): any;
    get period_days(): any;
    getRenewPrices(calculator: any, currency?: any): any;
    getPrices(calculator: any, currency?: any): any;
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
declare class CalculatorOutput {
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
//# sourceMappingURL=dist.d.ts.map