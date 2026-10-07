"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageOrder = exports.CalcUtils = exports.CalculatorOutput = exports.CurrencyRates = exports.CalculatorInput = void 0;
var Lang = /** @class */ (function () {
    function Lang(phases, locale) {
        if (phases === void 0) { phases = {
            "messages.landing.calculator.one-gb-price": {
                "uk": "\u0426\u0456\u043d\u0430 \u0437\u0430 GB",
                "en": "Price per GB",
                "pl": "Cena za GB",
                "ru": "\u0426\u0435\u043d\u0430 \u0437\u0430 GB"
            },
            "messages.landing.calculator.oneproxyprice": {
                "uk": "1 \u043f\u0440\u043e\u043a\u0441\u0456",
                "en": "1 proxy",
                "pl": "1 serwer proxy",
                "ru": "1 \u043f\u0440\u043e\u043a\u0441\u0438"
            }
        }; }
        if (locale === void 0) { locale = 'en'; }
        this.phases = phases;
        this.locale = locale;
    }
    Lang.prototype.get = function (key, args, locale) {
        if (args === void 0) { args = []; }
        if (locale === void 0) { locale = this.locale; }
        if (this.phases[key] && this.phases[key][locale]) {
            var phase = this.phases[key][locale];
            for (var i = 0; i < args.length; i++) {
                phase = phase.replace('{' + i + '}', args[i]);
            }
            return phase;
        }
        return key;
    };
    return Lang;
}());
var CalcUtils = /** @class */ (function () {
    function CalcUtils() {
    }
    /**
     * @param {*} value
     * @returns {boolean}
     */
    CalcUtils.is_empty = function (value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        else if (typeof value === 'object') {
            return Object.keys(value).length === 0;
        }
        return value === undefined || value === null || value === '';
    };
    /**
     * @param {string | number} key
     * @param {Record<any, any>} array
     * @returns {boolean}
     */
    CalcUtils.array_key_exists = function (key, array) {
        return key in array;
    };
    CalcUtils.is_numeric = function (value) {
        if ((undefined === value) || (null === value)) {
            return false;
        }
        if (typeof value == 'number') {
            return true;
        }
        return !isNaN(value - 0);
    };
    /**
     * @param {*} value
     * @returns {*}
     */
    CalcUtils.toNumbers = function (value) {
        if (typeof value === 'string' && value.trim() !== '' && !isNaN(value)) {
            return Number(value);
        }
        if (value !== null && typeof value === 'object') {
            var out = Array.isArray(value) ? [] : {};
            for (var key in value) {
                out[key] = CalcUtils.toNumbers(value[key]);
            }
            return out;
        }
        return value;
    };
    CalcUtils.round = function (num, dec) {
        if (dec === void 0) { dec = 0; }
        var num_sign = num >= 0 ? 1 : -1;
        return parseFloat((Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec));
    };
    CalcUtils.convertStorageUnit = function (size, fromUnit, toUnit, linux) {
        if (linux === void 0) { linux = false; }
        var scale = linux ? 1000 : 1024;
        var unitMap = {
            tb: Math.pow(scale, 4),
            gb: Math.pow(scale, 3),
            mb: Math.pow(scale, 2),
            kb: scale,
            b: 1,
        };
        fromUnit = fromUnit.toLowerCase();
        toUnit = toUnit.toLowerCase();
        if (!(fromUnit in unitMap) || !(toUnit in unitMap)) {
            return size;
        }
        return size * (unitMap[fromUnit] / unitMap[toUnit]);
    };
    CalcUtils.addMonthsDate = function (date, months) {
        var d = new Date(date.getTime());
        date.setMonth(date.getMonth() + +months);
        return date;
    };
    CalcUtils.convertTimeUnit = function (value, from, to) {
        var units = {
            's': 1,
            'mi': 60,
            'h': 3600,
            'd': 86400,
            'w': 604800,
            'mo': 2592000,
            'y': 31536000,
        };
        var xFrom = Object.keys(units).find(function (key) {
            return from.startsWith(key);
        });
        var xTo = Object.keys(units).find(function (key) {
            return to.startsWith(key);
        });
        if (!xFrom || !xTo) {
            return value;
        } // if mo, add months and get diff in seconds
        if (xFrom === 'mo') {
            var date = new Date();
            var diff = Math.floor((this.addMonthsDate(date, value) - new Date().getTime()) / 1000) / units[xTo];
            return Math.trunc(diff);
        }
        return Math.trunc(value * units[xFrom] / units[xTo]);
    };
    return CalcUtils;
}());
exports.CalcUtils = CalcUtils;
var CurrencyRates = /** @class */ (function () {
    function CurrencyRates(rates) {
        if (rates === void 0) { rates = {
            USD: 1,
            EUR: 0.87,
            GBP: 0.75,
            PLN: 3.7,
            UAH: 45.59
        }; }
        this.rates = rates;
    }
    CurrencyRates.prototype.get = function (currency) {
        return this.rates[currency];
    };
    CurrencyRates.prototype.format = function (value, currency) {
        var nf = null;
        try {
            nf = Intl.NumberFormat(loc, {
                style: "currency",
                currencyDisplay: 'narrowSymbol',
                // MacOS Throws error
                currency: currency,
            });
        }
        catch (e) {
            try {
                nf = Intl.NumberFormat(loc, {
                    style: "currency",
                    currencyDisplay: 'symbol',
                    currency: currency,
                });
            }
            catch (e) { }
        }
        return nf ? nf.format(value) : value + " " + currency;
    };
    return CurrencyRates;
}());
exports.CurrencyRates = CurrencyRates;
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
var PackageOrder = /** @class */ (function () {
    /**
     * @param {PackageOrderConstructor} [options={}]
     */
    function PackageOrder(_a) {
        var _b = _a === void 0 ? {} : _a, id = _b.id, count = _b.count, traffic_amount = _b.traffic_amount, traffic_unit = _b.traffic_unit, period_amount = _b.period_amount, period_unit = _b.period_unit, countries = _b.countries, currency = _b.currency, added_price_per_day = _b.added_price_per_day, type = _b.type, has_unlimited_auth_ips = _b.has_unlimited_auth_ips, user_id = _b.user_id, already_spent_in_usd = _b.already_spent_in_usd, version = _b.version, isRenew = _b.isRenew, ipScore = _b.ipScore, service = _b.service, bonuses = _b.bonuses;
        /** @type {number | null} */
        this.id = id || null;
        /** @type {number} */
        this.count = count || 0;
        /** @type {number} */
        this.traffic_amount = traffic_amount || 0;
        /** @type {string} */
        this.traffic_unit = traffic_unit || 'gb';
        /** @type {number} */
        this.period_amount = period_amount || 0;
        /** @type {string} */
        this.period_unit = period_unit || 'days';
        /** @type {Record<string, number>} */
        this.countries = countries || {};
        /** @type {string} */
        this.currency = currency || '';
        /** @type {number} */
        this.added_price_per_day = added_price_per_day || 0;
        /** @type {string} */
        this.type = type || '';
        /** @type {boolean} */
        this.has_unlimited_auth_ips = has_unlimited_auth_ips || false;
        /** @type {number} */
        this.user_id = user_id || 0;
        /** @type {number} */
        this.already_spent_in_usd = already_spent_in_usd || 0;
        /** @type {number} */
        this.version = version || -1;
        /** @type {number} */
        this.isRenew = isRenew || 0;
        /** @type {number} */
        this.ipScore = ipScore || 0;
        /** @type {string | null} */
        this.service = service || null;
        /** @type {Record<string, number>} */
        this.bonuses = bonuses || {};
    }
    Object.defineProperty(PackageOrder.prototype, "traffic_in_gb", {
        /**
         * @returns {number}
         */
        get: function () {
            return CalcUtils.convertStorageUnit(this.traffic_amount, this.traffic_unit, 'gb');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PackageOrder.prototype, "pay_for_setup", {
        /**
         * @returns {boolean}
         */
        get: function () {
            return this.type && this.type.includes('gb');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PackageOrder.prototype, "period_days", {
        /**
         * @returns {number}
         */
        get: function () {
            return CalcUtils.convertTimeUnit(this.period_amount, this.period_unit, 'days');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @param {Calculator} calculator
     * @param {string} currency
     * @returns {CalculatorOutput}
     */
    PackageOrder.prototype.getRenewPrices = function (calculator, currency, type) {
        if (currency === void 0) { currency = null; }
        if (type === void 0) { type = 1; }
        return (calculator || new Calculator()).calculate(new CalculatorInput(currency || this.currency, this.count, this.period_days, (!this.countries || Object.keys(this.countries).length == 0), this.added_price_per_day, this.type, this.has_unlimited_auth_ips, this.version, this.traffic_in_gb, this.user_id, type, this.ipScore, this.service, this.countries, this.bonuses));
    };
    /**
     * @param {Calculator} calculator
     * @param {string} currency
     * @returns {CalculatorOutput}
     */
    PackageOrder.prototype.getPrices = function (calculator, currency) {
        if (currency === void 0) { currency = null; }
        return (calculator || new Calculator()).calculate(new CalculatorInput(currency || this.currency, this.count, this.period_days, (!this.countries || Object.keys(this.countries).length == 0) && !this.pay_for_setup, this.added_price_per_day, this.type, this.has_unlimited_auth_ips, this.version, this.traffic_in_gb, this.user_id, 0, this.ipScore, this.service, this.countries, this.bonuses));
    };
    return PackageOrder;
}());
exports.PackageOrder = PackageOrder;
var CalculatorInput = /** @class */ (function () {
    function CalculatorInput(currencyOrOptions, proxyCount, daysCount, isRandomProxy, addedUSDToPerDay, proxyFor, hasUnlimitedIps, version, trafficInGb, ownerId, isRenew, ipScore, service, countries, bonuses, pricing) {
        if (currencyOrOptions === void 0) { currencyOrOptions = "USD"; }
        if (proxyCount === void 0) { proxyCount = 100; }
        if (daysCount === void 0) { daysCount = 29; }
        if (isRandomProxy === void 0) { isRandomProxy = true; }
        if (addedUSDToPerDay === void 0) { addedUSDToPerDay = 0; }
        if (proxyFor === void 0) { proxyFor = "shared"; }
        if (hasUnlimitedIps === void 0) { hasUnlimitedIps = false; }
        if (version === void 0) { version = -1; }
        if (trafficInGb === void 0) { trafficInGb = 25; }
        if (ownerId === void 0) { ownerId = -1; }
        if (isRenew === void 0) { isRenew = 0; }
        if (ipScore === void 0) { ipScore = 0; }
        if (service === void 0) { service = null; }
        if (countries === void 0) { countries = {}; }
        if (bonuses === void 0) { bonuses = {}; }
        if (pricing === void 0) { pricing = null; }
        var isObject = currencyOrOptions !== null && typeof currencyOrOptions === 'object' && currencyOrOptions.constructor === Object;
        this.currency = isObject ? ((currencyOrOptions["currency"] === undefined || currencyOrOptions["currency"] === null) ? "USD" : currencyOrOptions["currency"]) : currencyOrOptions;
        this.proxyCount = isObject ? ((currencyOrOptions["proxyCount"] === undefined || currencyOrOptions["proxyCount"] === null) ? 100 : currencyOrOptions["proxyCount"]) : proxyCount;
        this.daysCount = isObject ? ((currencyOrOptions["daysCount"] === undefined || currencyOrOptions["daysCount"] === null) ? 29 : currencyOrOptions["daysCount"]) : daysCount;
        this.isRandomProxy = isObject ? ((currencyOrOptions["isRandomProxy"] === undefined || currencyOrOptions["isRandomProxy"] === null) ? true : currencyOrOptions["isRandomProxy"]) : isRandomProxy;
        this.addedUSDToPerDay = isObject ? ((currencyOrOptions["addedUSDToPerDay"] === undefined || currencyOrOptions["addedUSDToPerDay"] === null) ? 0 : currencyOrOptions["addedUSDToPerDay"]) : addedUSDToPerDay;
        this.proxyFor = isObject ? ((currencyOrOptions["proxyFor"] === undefined || currencyOrOptions["proxyFor"] === null) ? "shared" : currencyOrOptions["proxyFor"]) : proxyFor;
        this.hasUnlimitedIps = isObject ? ((currencyOrOptions["hasUnlimitedIps"] === undefined || currencyOrOptions["hasUnlimitedIps"] === null) ? false : currencyOrOptions["hasUnlimitedIps"]) : hasUnlimitedIps;
        this.version = isObject ? ((currencyOrOptions["version"] === undefined || currencyOrOptions["version"] === null) ? -1 : currencyOrOptions["version"]) : version;
        this.trafficInGb = isObject ? ((currencyOrOptions["trafficInGb"] === undefined || currencyOrOptions["trafficInGb"] === null) ? 25 : currencyOrOptions["trafficInGb"]) : trafficInGb;
        this.ownerId = isObject ? ((currencyOrOptions["ownerId"] === undefined || currencyOrOptions["ownerId"] === null) ? -1 : currencyOrOptions["ownerId"]) : ownerId;
        this.isRenew = isObject ? ((currencyOrOptions["isRenew"] === undefined || currencyOrOptions["isRenew"] === null) ? 0 : currencyOrOptions["isRenew"]) : isRenew;
        this.ipScore = isObject ? ((currencyOrOptions["ipScore"] === undefined || currencyOrOptions["ipScore"] === null) ? 0 : currencyOrOptions["ipScore"]) : ipScore;
        this.service = isObject ? ((currencyOrOptions["service"] === undefined || currencyOrOptions["service"] === null) ? null : currencyOrOptions["service"]) : service;
        this.countries = isObject ? ((currencyOrOptions["countries"] === undefined || currencyOrOptions["countries"] === null) ? {} : currencyOrOptions["countries"]) : countries;
        this.bonuses = isObject ? ((currencyOrOptions["bonuses"] === undefined || currencyOrOptions["bonuses"] === null) ? {} : currencyOrOptions["bonuses"]) : bonuses;
        this.pricing = isObject ? ((currencyOrOptions["pricing"] === undefined || currencyOrOptions["pricing"] === null) ? null : currencyOrOptions["pricing"]) : pricing;
    }
    return CalculatorInput;
}());
exports.CalculatorInput = CalculatorInput;
/*
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
 * @property {Record<string, number>} fees
 * @property {Record<string, number>} bonuses
 * @property {number} calc_at
 */
var CalculatorOutput = /** @class */ (function () {
    function CalculatorOutput(options) {
        /** @type {number} */
        this.overall = options.overall || 0;
        /** @type {number} */
        this.oneProxy = options.oneProxy || 0;
        /** @type {string} */
        this.overallFormatted = options.overallFormatted || '';
        /** @type {string} */
        this.oneProxyFormatted = options.oneProxyFormatted || '';
        /** @type {number} */
        this.overallUSD = options.overallUSD || 0;
        /** @type {number} */
        this.oneProxyUSD = options.oneProxyUSD || 0;
        /** @type {string} */
        this.overallFormattedUSD = options.overallFormattedUSD || '';
        /** @type {string} */
        this.oneProxyFormattedUSD = options.oneProxyFormattedUSD || '';
        /** @type {number} */
        this.version = options.version || -1;
        /** @type {string} */
        this.currency = options.currency || 'USD';
        /** @type {number} */
        this.salePercentage = options.salePercentage || 1;
        /** @type {number} */
        this.saleAmountUSD = options.saleAmountUSD || 0;
        /** @type {number} */
        this.saleAmount = options.saleAmount || 0;
        /** @type {Record<string, number>} */
        this.fees = options.fees || {};
        /** @type {Record<string, number>} */
        this.bonuses = options.bonuses || {};
        /** @type {number} */
        this.calc_at = options.calc_at || 0;
    }
    return CalculatorOutput;
}());
exports.CalculatorOutput = CalculatorOutput;
var Calculator = /** @class */ (function () {
    /**
     * @callback userIdFetch
     * @returns {number}
     */
    /*
     * @callback salePercentageFetch
     * @returns {number}
     */
    /*
     * @callback localeFetch
     * @returns {string}
     */
    /*
     * @param {userIdFetch} userIdFetch
     * @param {salePercentageFetch} salePercentageFetch
     * @param {localeFetch} localeFetch
     */
    function Calculator(userIdFetch, salePercentageFetch, localeFetch) {
        if (userIdFetch === void 0) { userIdFetch = function () {
            return -1;
        }; }
        if (salePercentageFetch === void 0) { salePercentageFetch = function () {
            return 1;
        }; }
        if (localeFetch === void 0) { localeFetch = function () {
            return 'en';
        }; }
        this.currencyRates = new CurrencyRates();
        this.lang = new Lang();
        this.pricing = {
            "unlimited_ips_fee": {
                "default": 2,
                "mobile": 1,
                "payasgo": 1,
                "peer": 1
            },
            "referral_sale": 0.05,
            "per_gb": {
                "datacenter_gb": {
                    "1": 0.8,
                    "25": 0.75,
                    "100": 0.7,
                    "500": 0.6
                },
                "residential_gb": {
                    "0": 1.2,
                    "50": 1.1,
                    "100": 1,
                    "200": 0.95,
                    "500": 0.9,
                    "1000": 0.85,
                    "2000": 0.8,
                    "3000": 0.75,
                    "5000": 0.7,
                    "10000": 0.6
                },
                "mobile_rotating_gb": {
                    "1": 1.5,
                    "25": 1.4,
                    "50": 1.35,
                    "100": 1.25,
                    "500": 1.2,
                    "1000": 1.1
                },
                "mobile_shared_gb": {
                    "1": 1,
                    "25": 0.9,
                    "50": 0.85,
                    "100": 0.8,
                    "200": 0.75,
                    "500": 0.7,
                    "1000": 0.6
                }
            },
            "residential_static_gb": {
                "per_ip": 2,
                "per_gb_by_ips": {
                    "1": 1,
                    "5": 0.8,
                    "25": 0.7,
                    "50": 0.5
                }
            },
            "mobile_private_gb": {
                "by_min_days": {
                    "0": {
                        "per_modem": 2,
                        "per_gb": 0.5
                    },
                    "7": {
                        "per_modem": 10,
                        "per_gb": 0.5
                    },
                    "14": {
                        "per_modem": 20,
                        "per_gb": 0.5
                    },
                    "29": {
                        "per_modem": 30,
                        "per_gb": 0.3
                    }
                }
            },
            "mobile_static": {
                "by_max_days": {
                    "3": 4.2,
                    "18": 16.8
                },
                "beyond": 25.2,
                "year": {
                    "over_days": 35,
                    "x": 11
                }
            },
            "b2b_our_gb": {
                "per_gb": 2
            },
            "payasgo": {
                "flat": 1
            },
            "shared": {
                "per_ip": 0.08,
                "small_order": {
                    "below": 10,
                    "pct_per_missing_ip": 6
                },
                "count_multiplier": {
                    "0": 1.2,
                    "50": 1.1,
                    "100": 1,
                    "200": 0.97,
                    "500": 0.95,
                    "1000": 0.9,
                    "10000": 0
                }
            },
            "private": {
                "per_ip": 0.9,
                "small_order": {
                    "below": 10,
                    "pct_per_missing_ip": 4.8
                },
                "count_multiplier": {
                    "0": 1,
                    "50": 0.97,
                    "100": 0.95,
                    "200": 0.9,
                    "500": 0.9,
                    "1000": 0.9,
                    "10000": 0
                }
            },
            "country_multiplier": {
                "shared": {
                    "UA": 2
                },
                "private": []
            },
            "ip_packages": {
                "traffic": {
                    "unlimited": 50,
                    "linear": {
                        "over_gb": 800,
                        "gb_per_usd": 100
                    },
                    "base": {
                        "over_gb": 50,
                        "usd": 1
                    },
                    "steps": {
                        "150": 2,
                        "250": 3,
                        "350": 4,
                        "500": 8
                    }
                },
                "period": {
                    "year": {
                        "over_days": 33,
                        "ips_x": 11,
                        "traffic_x": 11
                    },
                    "month": {
                        "over_days": 22,
                        "ips_x": 1
                    },
                    "half": {
                        "over_days": 11,
                        "ips_div": 2,
                        "ips_x": 1.2
                    },
                    "quarter": {
                        "over_days": 1,
                        "ips_div": 4,
                        "ips_x": 1.4
                    }
                },
                "fees": {
                    "countries": 1,
                    "geo_service": 1
                },
                "ip_score": {
                    "min": 70,
                    "x": 1.25
                },
                "traffic_once": {
                    "below_first": 1,
                    "steps": {
                        "25": 0.5,
                        "100": 1.25,
                        "400": 5,
                        "800": 10,
                        "4000": 50
                    }
                }
            }
        };
        this.userBonuses = {};
        this.userIdFetch = userIdFetch;
        this.salePercentageFetch = salePercentageFetch;
        this.localeFetch = localeFetch;
    }
    Calculator.prototype.getLocale = function () {
        return this.localeFetch() || 'en';
    };
    Calculator.prototype.phase = function (key, args, locale) {
        if (args === void 0) { args = []; }
        if (locale === void 0) { locale = this.getLocale(); }
        return this.lang.get(key, args, locale);
    };
    Calculator.prototype.getSalePercentage = function () {
        return this.salePercentageFetch() || 1;
    };
    Calculator.prototype.getUserId = function () {
        return this.userIdFetch() || -1;
    };
    Calculator.prototype.isLogged = function () {
        return this.getUserId() > 0;
    };
    /**
     * @param {{pricing?: Object, fx?: {rates?: Object<string, (number|string)>}, user?: {sale_divisor?: (number|string), bonuses?: Object<string, (number|string)>}}} catalog
     * @returns {Calculator}
     */
    Calculator.prototype.setCatalog = function (catalog) {
        if (!catalog) {
            return this;
        }
        if (catalog.pricing) {
            this.pricing = CalcUtils.toNumbers(catalog.pricing);
        }
        if (catalog.fx && catalog.fx.rates) {
            this.currencyRates = new CurrencyRates(CalcUtils.toNumbers(catalog.fx.rates));
        }
        if (catalog.user) {
            var saleDivisor_1 = Number(catalog.user.sale_divisor) || 1;
            this.salePercentageFetch = function () {
                return saleDivisor_1;
            };
            this.userBonuses = CalcUtils.toNumbers(catalog.user.bonuses || {});
        }
        return this;
    };
    /**
     * @returns {Object}
     */
    Calculator.prototype.getPricing = function () {
        return this.pricing;
    };
    /**
     * @param {CalculatorInput} options
     * @returns {CalculatorOutput}
     */
    Calculator.prototype.calculate = function (options) {
        var currency = options.currency;
        var proxyCount = options.proxyCount;
        var daysCount = options.daysCount;
        var isRandomProxy = options.isRandomProxy;
        var addedUSDToPerDay = options.addedUSDToPerDay;
        var proxyFor = options.proxyFor;
        var hasUnlimitedIps = options.hasUnlimitedIps;
        var version = options.version;
        var trafficInGb = options.trafficInGb;
        var ownerId = options.ownerId;
        var isRenew = options.isRenew;
        var ipScore = options.ipScore;
        var service = options.service;
        var countries = options.countries;
        var bonuses = options.bonuses;
        var pricing = options.pricing;
        if (!bonuses || Object.keys(bonuses).length === 0) {
            bonuses = Object.assign({}, this.userBonuses);
        }
        pricing = pricing || this.pricing;
        var myId = this.isLogged() ? this.getUserId() : -1;
        var fees = {};
        console.debug(" [SPC]", "Renew type is ", isRenew);
        if (daysCount > 28 && daysCount < 32) {
            daysCount = 29;
        }
        if (version == -1) {
            version = 32;
        }
        if (ownerId == -1) {
            ownerId = myId;
        }
        if (!CalcUtils.is_numeric(trafficInGb)) {
            trafficInGb = 25;
        }
        var salePercentage = myId == ownerId ? this.getSalePercentage() : 1;
        var isPayAsGo = String.prototype.startsWith.call(proxyFor, "payasgo");
        var isMobile = String.prototype.startsWith.call(proxyFor, "mobile");
        var isResidential = String.prototype.startsWith.call(proxyFor, "residential");
        var isDatacenterGb = String.prototype.endsWith.call(proxyFor, "datacenter_gb");
        var isMobileRotating = String.prototype.endsWith.call(proxyFor, "mobile_rotating_gb");
        var isPayForUsage = (isPayAsGo || isMobile || isResidential) && (String.prototype.endsWith.call(proxyFor, "_gb") || String.prototype.endsWith.call(proxyFor, "_requests"));
        if (isResidential || isMobile) {
            salePercentage = 1;
        }
        var oneProxyPriceInUsd = 0;
        var proxyAllPriceInUsd = 0;
        var gbPrices = {};
        var hasTierPrice = false;
        var oneIpPrice = 0;
        var oneGbPrice = 0;
        var ipsPrice = 0;
        var gbsPrice = 0;
        if (isDatacenterGb) {
            gbPrices = pricing['per_gb']['datacenter_gb'];
            hasTierPrice = false;
            for (var _i = 0, _a = Object.keys(gbPrices); _i < _a.length; _i++) {
                var tierGbDc = _a[_i];
                if (!hasTierPrice || trafficInGb >= tierGbDc) {
                    oneProxyPriceInUsd = gbPrices[tierGbDc];
                    hasTierPrice = true;
                }
            }
            proxyAllPriceInUsd = oneProxyPriceInUsd * trafficInGb;
            fees['one_gb'] = oneProxyPriceInUsd;
            fees['traffic'] = proxyAllPriceInUsd;
        }
        else if (proxyFor == "b2b_our_gb") {
            oneProxyPriceInUsd = pricing['b2b_our_gb']['per_gb'];
            proxyAllPriceInUsd = oneProxyPriceInUsd * trafficInGb;
            fees['one_gb'] = oneProxyPriceInUsd;
            fees['traffic'] = proxyAllPriceInUsd;
        }
        else if (proxyFor == "residential_static_gb") {
            oneIpPrice = pricing['residential_static_gb']['per_ip'];
            gbPrices = pricing['residential_static_gb']['per_gb_by_ips'];
            hasTierPrice = false;
            for (var _b = 0, _c = Object.keys(gbPrices); _b < _c.length; _b++) {
                var tierIpResStatic = _c[_b];
                if (!hasTierPrice || proxyCount >= tierIpResStatic) {
                    oneGbPrice = gbPrices[tierIpResStatic];
                    hasTierPrice = true;
                }
            }
            ipsPrice = isRenew > 1 ? 0 : (proxyCount * oneIpPrice);
            gbsPrice = isRenew == 1 ? 0 : (oneGbPrice * trafficInGb);
            fees['ip'] = ipsPrice;
            fees['one_gb'] = oneGbPrice;
            fees['traffic'] = gbsPrice;
            oneProxyPriceInUsd = oneGbPrice;
            proxyAllPriceInUsd = ipsPrice + gbsPrice;
        }
        else if (isResidential) {
            gbPrices = pricing['per_gb']['residential_gb'];
            hasTierPrice = false;
            for (var _d = 0, _e = Object.keys(gbPrices); _d < _e.length; _d++) {
                var tierGbRes = _e[_d];
                if (!hasTierPrice || trafficInGb >= tierGbRes) {
                    oneProxyPriceInUsd = gbPrices[tierGbRes];
                    hasTierPrice = true;
                }
            }
            proxyAllPriceInUsd = oneProxyPriceInUsd * trafficInGb;
            fees['one_gb'] = oneProxyPriceInUsd;
            fees['traffic'] = proxyAllPriceInUsd;
        }
        else if (isMobileRotating) {
            gbPrices = pricing['per_gb']['mobile_rotating_gb'];
            hasTierPrice = false;
            for (var _f = 0, _g = Object.keys(gbPrices); _f < _g.length; _f++) {
                var tierGbMob = _g[_f];
                if (!hasTierPrice || trafficInGb >= tierGbMob) {
                    oneProxyPriceInUsd = gbPrices[tierGbMob];
                    hasTierPrice = true;
                }
            }
            proxyAllPriceInUsd = oneProxyPriceInUsd * trafficInGb;
            fees['one_gb'] = oneProxyPriceInUsd;
            fees['traffic'] = proxyAllPriceInUsd;
        }
        else if (isMobile) {
            if (String.prototype.endsWith.call(proxyFor, "modem") || String.prototype.endsWith.call(proxyFor, "static")) {
                oneProxyPriceInUsd = pricing['mobile_static']['beyond'];
                hasTierPrice = false;
                for (var _h = 0, _j = Object.keys(pricing['mobile_static']['by_max_days']); _h < _j.length; _h++) {
                    var tierDaysStatic = _j[_h];
                    if (!hasTierPrice && daysCount <= tierDaysStatic) {
                        oneProxyPriceInUsd = pricing['mobile_static']['by_max_days'][tierDaysStatic];
                        hasTierPrice = true;
                    }
                }
                proxyAllPriceInUsd = oneProxyPriceInUsd * proxyCount;
                if (daysCount > pricing['mobile_static']['year']['over_days']) {
                    proxyAllPriceInUsd = proxyAllPriceInUsd * pricing['mobile_static']['year']['x'];
                }
                fees['ip'] = oneProxyPriceInUsd;
            }
            else if (String.prototype.endsWith.call(proxyFor, "static_gb") || proxyFor == "mobile_private_gb") {
                hasTierPrice = false;
                for (var _k = 0, _l = Object.keys(pricing['mobile_private_gb']['by_min_days']); _k < _l.length; _k++) {
                    var tierDaysModem = _l[_k];
                    if (!hasTierPrice || daysCount >= tierDaysModem) {
                        oneIpPrice = pricing['mobile_private_gb']['by_min_days'][tierDaysModem]['per_modem'];
                        oneGbPrice = pricing['mobile_private_gb']['by_min_days'][tierDaysModem]['per_gb'];
                        hasTierPrice = true;
                    }
                }
                ipsPrice = isRenew > 1 ? 0 : (proxyCount * oneIpPrice);
                gbsPrice = isRenew == 1 ? 0 : (oneGbPrice * trafficInGb);
                oneProxyPriceInUsd = oneGbPrice;
                proxyAllPriceInUsd = ipsPrice + gbsPrice;
                fees['ip'] = ipsPrice;
                fees['one_gb'] = oneGbPrice;
                fees['traffic'] = gbsPrice;
            }
            else {
                gbPrices = pricing['per_gb']['mobile_shared_gb'];
                hasTierPrice = false;
                for (var _m = 0, _o = Object.keys(gbPrices); _m < _o.length; _m++) {
                    var tierGbMobShared = _o[_m];
                    if (!hasTierPrice || trafficInGb >= tierGbMobShared) {
                        oneProxyPriceInUsd = gbPrices[tierGbMobShared];
                        hasTierPrice = true;
                    }
                }
                proxyAllPriceInUsd = oneProxyPriceInUsd * trafficInGb;
                fees['one_gb'] = oneProxyPriceInUsd;
                fees['traffic'] = proxyAllPriceInUsd;
            }
        }
        else if (isPayAsGo) {
            oneProxyPriceInUsd = pricing['payasgo']['flat'];
            proxyAllPriceInUsd = pricing['payasgo']['flat'];
        }
        else {
            if (isRenew == 4) {
                oneProxyPriceInUsd = 0;
                proxyAllPriceInUsd = pricing['ip_packages']['traffic_once']['below_first'];
                for (var _p = 0, _q = Object.keys(pricing['ip_packages']['traffic_once']['steps']); _p < _q.length; _p++) {
                    var tierTrafficOnce = _q[_p];
                    if (trafficInGb >= tierTrafficOnce) {
                        proxyAllPriceInUsd = pricing['ip_packages']['traffic_once']['steps'][tierTrafficOnce];
                    }
                }
                fees['traffic'] = proxyAllPriceInUsd;
                salePercentage = 1;
            }
            else if (version >= 30) {
                var priceTraffic = 0;
                oneProxyPriceInUsd = 0;
                var addService = 0;
                var discount = 0;
                var defaultProxy = false;
                var addPercentageOne = 1;
                if (proxyFor == "private" || proxyFor == "shared") {
                    oneProxyPriceInUsd = pricing[proxyFor]['per_ip'];
                    defaultProxy = true;
                    addPercentageOne = pricing[proxyFor]['small_order']['pct_per_missing_ip'] * (pricing[proxyFor]['small_order']['below'] - proxyCount);
                }
                var isSmallCount = defaultProxy && proxyCount < pricing[proxyFor]['small_order']['below'];
                if (isSmallCount) {
                    console.debug(" [SPC]", "[PRE] Using cheap proxies, orig price: ", oneProxyPriceInUsd);
                    oneProxyPriceInUsd = oneProxyPriceInUsd * (1 + addPercentageOne / 100);
                    console.debug(" [SPC]", "Using cheap proxies ", addPercentageOne);
                }
                var proxyALlPriceInUsdPre = proxyCount * oneProxyPriceInUsd;
                fees['ip'] = oneProxyPriceInUsd;
                if (version >= 31 && !isRandomProxy) {
                    var LproxyALlPriceInUsdPre = 0;
                    var typedPriceMultipliers = pricing['country_multiplier'];
                    var priceMultiplied = typedPriceMultipliers[proxyFor] || [];
                    for (var _r = 0, _s = Object.keys(countries); _r < _s.length; _r++) {
                        var country = _s[_r];
                        var ipMultiple = priceMultiplied[country] || 1;
                        var count = countries[country] || 0;
                        LproxyALlPriceInUsdPre += oneProxyPriceInUsd * ipMultiple * count;
                    }
                    console.debug(" [SPC]", LproxyALlPriceInUsdPre, proxyALlPriceInUsdPre);
                    if (LproxyALlPriceInUsdPre > proxyALlPriceInUsdPre) {
                        fees['countries_specify'] = LproxyALlPriceInUsdPre - proxyALlPriceInUsdPre;
                        proxyALlPriceInUsdPre = LproxyALlPriceInUsdPre;
                    }
                }
                if (trafficInGb == 0) {
                    priceTraffic = pricing['ip_packages']['traffic']['unlimited'];
                }
                else if (trafficInGb > pricing['ip_packages']['traffic']['linear']['over_gb']) {
                    priceTraffic = CalcUtils.round(trafficInGb / pricing['ip_packages']['traffic']['linear']['gb_per_usd'], 2);
                }
                else {
                    if (trafficInGb > pricing['ip_packages']['traffic']['base']['over_gb']) {
                        priceTraffic = pricing['ip_packages']['traffic']['base']['usd'];
                    }
                    for (var _t = 0, _u = Object.keys(pricing['ip_packages']['traffic']['steps']); _t < _u.length; _t++) {
                        var tierTrafficIp = _u[_t];
                        if (trafficInGb >= tierTrafficIp) {
                            priceTraffic = pricing['ip_packages']['traffic']['steps'][tierTrafficIp];
                        }
                    }
                }
                if (!isRandomProxy) {
                    addService += pricing['ip_packages']['fees']['countries'];
                    fees['countries'] = addService;
                }
                if (proxyFor == 'shared' || proxyFor == 'private') {
                    hasTierPrice = false;
                    for (var _v = 0, _w = Object.keys(pricing[proxyFor]['count_multiplier']); _v < _w.length; _v++) {
                        var tierCountIp = _w[_v];
                        if (!hasTierPrice || proxyCount >= tierCountIp) {
                            discount = pricing[proxyFor]['count_multiplier'][tierCountIp];
                            hasTierPrice = true;
                        }
                    }
                }
                proxyAllPriceInUsd = (proxyALlPriceInUsdPre) * discount;
                fees['ips'] = proxyALlPriceInUsdPre;
                var daysPrices = 0;
                if (daysCount > pricing['ip_packages']['period']['year']['over_days']) {
                    priceTraffic = priceTraffic * pricing['ip_packages']['period']['year']['traffic_x'];
                    daysPrices = (proxyAllPriceInUsd * pricing['ip_packages']['period']['year']['ips_x']);
                }
                else if (daysCount > pricing['ip_packages']['period']['month']['over_days'] || isSmallCount) {
                    daysPrices = (proxyAllPriceInUsd * pricing['ip_packages']['period']['month']['ips_x']);
                }
                else if (daysCount > pricing['ip_packages']['period']['half']['over_days']) {
                    daysPrices = ((proxyAllPriceInUsd / pricing['ip_packages']['period']['half']['ips_div']) * pricing['ip_packages']['period']['half']['ips_x']);
                }
                else if (daysCount > pricing['ip_packages']['period']['quarter']['over_days']) {
                    daysPrices = ((proxyAllPriceInUsd / pricing['ip_packages']['period']['quarter']['ips_div']) * pricing['ip_packages']['period']['quarter']['ips_x']);
                }
                if (isRenew != 6) {
                    fees['traffic'] = priceTraffic;
                    fees['days'] = daysPrices - proxyAllPriceInUsd;
                    proxyAllPriceInUsd = daysPrices + addService + priceTraffic;
                }
                if (service && service != 'overall') {
                    proxyAllPriceInUsd += pricing['ip_packages']['fees']['geo_service'];
                    fees['geo_service'] = pricing['ip_packages']['fees']['geo_service'];
                }
                if (ipScore >= pricing['ip_packages']['ip_score']['min']) {
                    var scorePrice = proxyAllPriceInUsd * pricing['ip_packages']['ip_score']['x'];
                    fees['ip_score'] = scorePrice - proxyAllPriceInUsd;
                    proxyAllPriceInUsd = scorePrice;
                }
            }
            else { }
        }
        if (isPayForUsage && addedUSDToPerDay > 0) {
            var oldTrafficPrice = fees['traffic'] || 0;
            var newTrafficPrice = addedUSDToPerDay * trafficInGb;
            fees['one_gb'] = addedUSDToPerDay;
            fees['traffic'] = newTrafficPrice;
            proxyAllPriceInUsd = proxyAllPriceInUsd - oldTrafficPrice + newTrafficPrice;
        }
        var proxyAllPriceInUsdWithSale = proxyAllPriceInUsd / salePercentage;
        var saleAmountInUSD = proxyAllPriceInUsd - proxyAllPriceInUsdWithSale;
        proxyAllPriceInUsd = proxyAllPriceInUsd - saleAmountInUSD;
        var overAllBonus = 0;
        for (var _x = 0, _y = Object.keys(bonuses); _x < _y.length; _x++) {
            var type = _y[_x];
            var value = bonuses[type];
            var withBonusPrice = 0;
            if (type == 'multiple') {
                withBonusPrice = proxyAllPriceInUsd * value;
            }
            else if (type == 'add') {
                withBonusPrice = proxyAllPriceInUsd + value;
            }
            else if (type == 'percent') {
                withBonusPrice = proxyAllPriceInUsd * value;
            }
            else if (type == 'percent_add') {
                withBonusPrice = proxyAllPriceInUsd + (proxyAllPriceInUsd * value);
            }
            else {
                console.debug(" [SPC]", "Unknown bonus type");
                console.debug(" [SPC]", type);
            }
            var diffBonus = withBonusPrice - proxyAllPriceInUsd;
            overAllBonus += diffBonus;
        }
        proxyAllPriceInUsd = proxyAllPriceInUsd - overAllBonus;
        if (overAllBonus > 0) {
            fees['bonus'] = -overAllBonus;
        }
        if (addedUSDToPerDay > 0 && !isPayForUsage) {
            proxyAllPriceInUsd += addedUSDToPerDay * daysCount;
        }
        if (hasUnlimitedIps) {
            var addUnlimPrice = 0;
            if (isPayAsGo) {
                addUnlimPrice += pricing['unlimited_ips_fee']['payasgo'];
            }
            if (isMobile) {
                addUnlimPrice += pricing['unlimited_ips_fee']['mobile'];
            }
            else {
                addUnlimPrice += pricing['unlimited_ips_fee']['default'];
            }
            if (addUnlimPrice > 0) {
                fees['unlim_ips'] = addUnlimPrice;
                proxyAllPriceInUsd += addUnlimPrice;
            }
        }
        var usdRate = this.currencyRates.get('USD');
        var currencyRate = this.currencyRates.get(currency);
        var totalPriceUSD = CalcUtils.round((Math.abs(proxyAllPriceInUsd)) * usdRate, 2);
        var oneProxyPriceUSD = CalcUtils.round((Math.abs(oneProxyPriceInUsd)) * usdRate, 2);
        var totalPrice = CalcUtils.round((Math.abs(totalPriceUSD)) * currencyRate, 2);
        var oneProxyPrice = CalcUtils.round((Math.abs(oneProxyPriceUSD)) * currencyRate, 2);
        if (proxyFor == "free") {
            oneProxyPriceUSD = 0;
            totalPriceUSD = 0;
            oneProxyPrice = 0;
            totalPrice = 0;
        }
        var total = this.currencyRates.format(totalPrice, currency);
        var additional = this.currencyRates.format(oneProxyPrice, currency);
        var totalUSD = this.currencyRates.format(totalPriceUSD, 'USD');
        var additionalUSD = this.currencyRates.format(oneProxyPriceUSD, 'USD');
        return new CalculatorOutput({
            'overall': totalPrice,
            'oneProxy': oneProxyPrice,
            'overallFormatted': total,
            'oneProxyFormatted': additional + " - " + (String.prototype.endsWith.call(proxyFor, '_gb') ? this.phase("messages.landing.calculator.one-gb-price") : this.phase("messages.landing.calculator.oneproxyprice")),
            'overallUSD': totalPriceUSD,
            'oneProxyUSD': oneProxyPriceUSD,
            'overallFormattedUSD': totalUSD,
            'version': version,
            'oneProxyFormattedUSD': additionalUSD + " - " + this.phase("messages.landing.calculator.oneproxyprice"),
            'currency': currency,
            'salePercentage': salePercentage,
            /* Added in 1.2 (from 1.0 to 2.0) */
            'saleAmountUSD': CalcUtils.round(Math.abs(saleAmountInUSD), 2),
            /* Added in 1.3 */
            'saleAmount': CalcUtils.round(Math.abs(saleAmountInUSD) * this.currencyRates.get(currency), 2),
            /* Added in 1.3 */
            'fees': fees,
            'bonuses': bonuses,
            'calc_at': Date.now() / 1000,
        });
    };
    return Calculator;
}());
exports.default = Calculator;
