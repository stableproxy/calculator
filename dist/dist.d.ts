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
    pricing: {
        unlimited_ips_fee: {
            default: number;
            mobile: number;
            payasgo: number;
            peer: number;
        };
        referral_sale: number;
        per_gb: {
            datacenter_gb: {
                "1": number;
                "25": number;
                "100": number;
                "500": number;
            };
            residential_gb: {
                "0": number;
                "50": number;
                "100": number;
                "200": number;
                "500": number;
                "1000": number;
                "2000": number;
                "3000": number;
                "5000": number;
                "10000": number;
            };
            mobile_rotating_gb: {
                "1": number;
                "25": number;
                "50": number;
                "100": number;
                "500": number;
                "1000": number;
            };
            mobile_shared_gb: {
                "1": number;
                "25": number;
                "50": number;
                "100": number;
                "200": number;
                "500": number;
                "1000": number;
            };
        };
        residential_static_gb: {
            per_ip: number;
            per_gb_by_ips: {
                "1": number;
                "5": number;
                "25": number;
                "50": number;
            };
        };
        mobile_private_gb: {
            by_min_days: {
                "0": {
                    per_modem: number;
                    per_gb: number;
                };
                "7": {
                    per_modem: number;
                    per_gb: number;
                };
                "14": {
                    per_modem: number;
                    per_gb: number;
                };
                "29": {
                    per_modem: number;
                    per_gb: number;
                };
            };
        };
        mobile_static: {
            by_max_days: {
                "3": number;
                "18": number;
            };
            beyond: number;
            year: {
                over_days: number;
                x: number;
            };
        };
        b2b_our_gb: {
            per_gb: number;
        };
        payasgo: {
            flat: number;
        };
        shared: {
            per_ip: number;
            small_order: {
                below: number;
                pct_per_missing_ip: number;
            };
            count_multiplier: {
                "0": number;
                "50": number;
                "100": number;
                "200": number;
                "500": number;
                "1000": number;
                "10000": number;
            };
        };
        private: {
            per_ip: number;
            small_order: {
                below: number;
                pct_per_missing_ip: number;
            };
            count_multiplier: {
                "0": number;
                "50": number;
                "100": number;
                "200": number;
                "500": number;
                "1000": number;
                "10000": number;
            };
        };
        country_multiplier: {
            shared: {
                UA: number;
            };
            private: any[];
        };
        ip_packages: {
            traffic: {
                unlimited: number;
                linear: {
                    over_gb: number;
                    gb_per_usd: number;
                };
                base: {
                    over_gb: number;
                    usd: number;
                };
                steps: {
                    "150": number;
                    "250": number;
                    "350": number;
                    "500": number;
                };
            };
            period: {
                year: {
                    over_days: number;
                    ips_x: number;
                    traffic_x: number;
                };
                month: {
                    over_days: number;
                    ips_x: number;
                };
                half: {
                    over_days: number;
                    ips_div: number;
                    ips_x: number;
                };
                quarter: {
                    over_days: number;
                    ips_div: number;
                    ips_x: number;
                };
            };
            fees: {
                countries: number;
                geo_service: number;
            };
            ip_score: {
                min: number;
                x: number;
            };
            traffic_once: {
                below_first: number;
                steps: {
                    "25": number;
                    "100": number;
                    "400": number;
                    "800": number;
                    "4000": number;
                };
            };
        };
    };
    userBonuses: {};
    userIdFetch: () => number;
    salePercentageFetch: () => number;
    localeFetch: () => string;
    getLocale(): string;
    phase(key: any, args?: any[], locale?: string): any;
    getSalePercentage(): number;
    getUserId(): number;
    isLogged(): boolean;
    /**
     * @param {{pricing?: Object, fx?: {rates?: Object<string, (number|string)>}, user?: {sale_divisor?: (number|string), bonuses?: Object<string, (number|string)>}}} catalog
     * @returns {Calculator}
     */
    setCatalog(catalog: {
        pricing?: any;
        fx?: {
            rates?: {
                [x: string]: (number | string);
            };
        };
        user?: {
            sale_divisor?: (number | string);
            bonuses?: {
                [x: string]: (number | string);
            };
        };
    }): Calculator;
    /**
     * @returns {Object}
     */
    getPricing(): any;
    /**
     * @param {CalculatorInput} options
     * @returns {CalculatorOutput}
     */
    calculate(options: CalculatorInput): CalculatorOutput;
}
export class CalculatorInput {
    constructor(currencyOrOptions?: string, proxyCount?: number, daysCount?: number, isRandomProxy?: boolean, addedUSDToPerDay?: number, proxyFor?: string, hasUnlimitedIps?: boolean, version?: number, trafficInGb?: number, ownerId?: number, isRenew?: number, ipScore?: number, service?: any, countries?: {}, bonuses?: {}, pricing?: any);
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
    isRenew: any;
    ipScore: any;
    service: any;
    countries: any;
    bonuses: any;
    pricing: any;
}
export class CurrencyRates {
    constructor(rates?: {
        USD: number;
        EUR: number;
        GBP: number;
        PLN: number;
        UAH: number;
    });
    rates: {
        USD: number;
        EUR: number;
        GBP: number;
        PLN: number;
        UAH: number;
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
    /**
     * @param {*} value
     * @returns {*}
     */
    static toNumbers(value: any): any;
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