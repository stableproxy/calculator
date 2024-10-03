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
            EUR: 0.92,
            GBP: 0.78,
            UAH: 41.12,
            USD: 1,
            PLN: 3.92
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
 */
/**
 * @class
 */
var PackageOrder = /** @class */ (function () {
    /**
     * @param {PackageOrderConstructor} [options={}]
     */
    function PackageOrder(_a) {
        var _b = _a === void 0 ? {} : _a, id = _b.id, count = _b.count, traffic_amount = _b.traffic_amount, traffic_unit = _b.traffic_unit, period_amount = _b.period_amount, period_unit = _b.period_unit, countries = _b.countries, currency = _b.currency, added_price_per_day = _b.added_price_per_day, type = _b.type, has_unlimited_auth_ips = _b.has_unlimited_auth_ips, user_id = _b.user_id, already_spent_in_usd = _b.already_spent_in_usd, version = _b.version, isRenew = _b.isRenew, ipScore = _b.ipScore, service = _b.service;
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
        return (calculator || new Calculator()).calculate(new CalculatorInput(currency || this.currency, this.count, this.period_days, (!this.countries || Object.keys(this.countries).length == 0), this.added_price_per_day, this.type, this.has_unlimited_auth_ips, this.version, this.traffic_in_gb, this.user_id, type, this.ipScore, this.service, this.countries));
    };
    /**
     * @param {Calculator} calculator
     * @param {string} currency
     * @returns {CalculatorOutput}
     */
    PackageOrder.prototype.getPrices = function (calculator, currency) {
        if (currency === void 0) { currency = null; }
        return (calculator || new Calculator()).calculate(new CalculatorInput(currency || this.currency, this.count, this.period_days, (!this.countries || Object.keys(this.countries).length == 0) && !this.pay_for_setup, this.added_price_per_day, this.type, this.has_unlimited_auth_ips, this.version, this.traffic_in_gb, this.user_id, 0, this.ipScore, this.service, this.countries));
    };
    return PackageOrder;
}());
exports.PackageOrder = PackageOrder;
var CalculatorInput = /** @class */ (function () {
    function CalculatorInput(currencyOrOptions, proxyCount, daysCount, isRandomProxy, addedUSDToPerDay, proxyFor, hasUnlimitedIps, version, trafficInGb, ownerId, isRenew, ipScore, service, countries) {
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
        var isObject = currencyOrOptions !== null && typeof currencyOrOptions === 'object' && currencyOrOptions.constructor === Object;
        this.currency = isObject ? (currencyOrOptions["currency"] || "USD") : currencyOrOptions;
        this.proxyCount = isObject ? (currencyOrOptions["proxyCount"] || 100) : proxyCount;
        this.daysCount = isObject ? (currencyOrOptions["daysCount"] || 29) : daysCount;
        this.isRandomProxy = isObject ? (currencyOrOptions["isRandomProxy"] || true) : isRandomProxy;
        this.addedUSDToPerDay = isObject ? (currencyOrOptions["addedUSDToPerDay"] || 0) : addedUSDToPerDay;
        this.proxyFor = isObject ? (currencyOrOptions["proxyFor"] || "shared") : proxyFor;
        this.hasUnlimitedIps = isObject ? (currencyOrOptions["hasUnlimitedIps"] || false) : hasUnlimitedIps;
        this.version = isObject ? (currencyOrOptions["version"] || -1) : version;
        this.trafficInGb = isObject ? (currencyOrOptions["trafficInGb"] || 25) : trafficInGb;
        this.ownerId = isObject ? (currencyOrOptions["ownerId"] || -1) : ownerId;
        this.isRenew = isObject ? (currencyOrOptions["isRenew"] || 0) : isRenew;
        this.ipScore = isObject ? (currencyOrOptions["ipScore"] || 0) : ipScore;
        this.service = isObject ? (currencyOrOptions["service"] || null) : service;
        this.countries = isObject ? (currencyOrOptions["countries"] || {}) : countries;
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
        var myId = this.isLogged() ? this.getUserId() : -1;
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
        if (isResidential || isMobile) {
            salePercentage = 1;
        }
        var oneProxyPriceInUsd = ((0.03 * 3) / 29) * daysCount;
        var proxyAllPriceInUsd = 1;
        if (proxyFor == "residential_static_gb") {
            var oneIpPrice = 2;
            var oneGbPrice = 3;
            if (version > 32) {
                oneIpPrice = 2;
                oneGbPrice = 1;
            }
            var ipsPrice = isRenew > 1 ? 0 : (proxyCount * oneIpPrice);
            var gbsPrice = isRenew == 1 ? 0 : (oneGbPrice * trafficInGb);
            oneProxyPriceInUsd = oneGbPrice;
            proxyAllPriceInUsd = ipsPrice + gbsPrice;
        }
        else if (isResidential) {
            var gbPrices = {
                "1": 1.65,
                "5": 1.6,
                "25": 1.55,
                "50": 1.5
            };
            oneProxyPriceInUsd = gbPrices[trafficInGb] || 100;
            proxyAllPriceInUsd = oneProxyPriceInUsd * trafficInGb;
        }
        else if (isMobile) {
            if (String.prototype.endsWith.call(proxyFor, "modem") || String.prototype.endsWith.call(proxyFor, "static")) {
                if (daysCount <= 3) {
                    oneProxyPriceInUsd = 4.2;
                }
                else if (daysCount >= 3 && daysCount <= 18) {
                    oneProxyPriceInUsd = 16.8;
                }
                else {
                    oneProxyPriceInUsd = 25.2;
                }
                proxyAllPriceInUsd = oneProxyPriceInUsd * proxyCount;
                if (daysCount > 35) {
                    proxyAllPriceInUsd = proxyAllPriceInUsd * 11;
                }
            }
            else if (String.prototype.endsWith.call(proxyFor, "static_gb")) {
                oneGbPrice = 0.5;
                oneIpPrice = 20;
                if (daysCount <= 3) {
                    oneIpPrice = 3;
                    oneGbPrice = 1;
                }
                else if (daysCount >= 3 && daysCount <= 18) {
                    oneIpPrice = 12;
                    oneGbPrice = 0.75;
                }
                ipsPrice = isRenew > 1 ? 0 : (proxyCount * oneIpPrice);
                gbsPrice = isRenew == 1 ? 0 : (oneGbPrice * trafficInGb);
                oneProxyPriceInUsd = oneGbPrice;
                proxyAllPriceInUsd = ipsPrice + gbsPrice;
            }
            else {
                oneProxyPriceInUsd = 0.85;
                proxyAllPriceInUsd = oneProxyPriceInUsd * proxyCount;
            }
        }
        else if (isPayAsGo) {
            oneProxyPriceInUsd = 1;
            proxyAllPriceInUsd = 1;
        }
        else {
            /* Traffic additional */
            if (isRenew == 4) {
                /*
 * 25гб 0,5
    100гб 1,25
    400гб 5
    800 10
 */
                oneProxyPriceInUsd = 0;
                if (trafficInGb >= 4000) {
                    proxyAllPriceInUsd = 50;
                }
                else if (trafficInGb >= 800) {
                    proxyAllPriceInUsd = 10;
                }
                else if (trafficInGb >= 400) {
                    proxyAllPriceInUsd = 5;
                }
                else if (trafficInGb >= 100) {
                    proxyAllPriceInUsd = 1.25;
                }
                else if (trafficInGb >= 25) {
                    proxyAllPriceInUsd = 0.5;
                }
                salePercentage = 1;
            }
            else if (version >= 30) {
                var priceTraffic = 0;
                oneProxyPriceInUsd = 0;
                var addService = 0;
                var discount = 0;
                /* ----- Count ----- */
                if (proxyFor == "private") {
                    oneProxyPriceInUsd = 0.9;
                }
                else if (proxyFor == "shared") {
                    oneProxyPriceInUsd = 0.08;
                }
                var proxyALlPriceInUsdPre = proxyCount * oneProxyPriceInUsd;
                if (version >= 31 && !isRandomProxy) {
                    var LproxyALlPriceInUsdPre = 0;
                    var typedPriceMultipliers = {
                        "shared": {
                            "UA": 2
                        }
                    };
                    var priceMultiplied = typedPriceMultipliers[proxyFor] || [];
                    // for on countries
                    for (var _i = 0, _a = Object.keys(countries); _i < _a.length; _i++) {
                        var country = _a[_i];
                        var ipMultiple = priceMultiplied[country] || 1;
                        var count = countries[country] || 0;
                        LproxyALlPriceInUsdPre += oneProxyPriceInUsd * ipMultiple * count;
                    }
                    console.debug(" [SPC]", LproxyALlPriceInUsdPre, proxyALlPriceInUsdPre);
                    if (LproxyALlPriceInUsdPre > proxyALlPriceInUsdPre) {
                        proxyALlPriceInUsdPre = LproxyALlPriceInUsdPre;
                    }
                }
                /* ----- Count ----- */
                /* ----- Traffic ----- */
                if (trafficInGb > 50 && trafficInGb < 150) {
                    priceTraffic = 1;
                }
                else if (trafficInGb > 150 && trafficInGb < 250) {
                    priceTraffic = 2;
                }
                else if (trafficInGb > 250 && trafficInGb < 350) {
                    priceTraffic = 3;
                }
                else if (trafficInGb > 350 && trafficInGb < 500) {
                    priceTraffic = 4;
                }
                else if (trafficInGb > 4000) {
                    priceTraffic = 50;
                }
                else if (trafficInGb > 500) {
                    priceTraffic = 8;
                }
                else if (trafficInGb == 0) {
                    priceTraffic = 50;
                }
                /* ----- Traffic ----- */
                /* ----- Adds ----- */
                if (!isRandomProxy) {
                    addService += 1;
                }
                /* ----- Adds ----- */
                /* ----- Count discount ----- */
                if (proxyFor == 'shared') {
                    if (proxyCount < 50) {
                        discount = 1.2;
                    }
                    else if (proxyCount < 100) {
                        discount = 1.1;
                    }
                    else if (proxyCount < 200) {
                        discount = 1;
                    }
                    else if (proxyCount < 500) {
                        discount = 0.97;
                    }
                    else if (proxyCount < 1000) {
                        discount = 0.95;
                    }
                    else if (proxyCount < 10000) {
                        discount = 0.9;
                    }
                }
                else if (proxyFor == 'private') {
                    if (proxyCount < 50) {
                        discount = 1;
                    }
                    else if (proxyCount < 100) {
                        discount = 0.97;
                    }
                    else if (proxyCount < 200) {
                        discount = 0.95;
                    }
                    else if (proxyCount < 500) {
                        discount = 0.9;
                    }
                    else if (proxyCount < 1000) {
                        discount = 0.9;
                    }
                    else if (proxyCount < 10000) {
                        discount = 0.9;
                    }
                }
                /* ----- Count discount ----- */
                proxyAllPriceInUsd = (proxyALlPriceInUsdPre) * discount;
                proxyAllPriceInUsd = proxyAllPriceInUsd;
                /* ----- Day pricing ----- */
                if (daysCount > 33) {
                    proxyAllPriceInUsd = (proxyAllPriceInUsd * 11) + (priceTraffic * 11);
                }
                else if (daysCount > 22) {
                    proxyAllPriceInUsd = (proxyAllPriceInUsd * 1) + priceTraffic;
                }
                else if (daysCount > 11) {
                    proxyAllPriceInUsd = ((proxyAllPriceInUsd / 2) * 1.2) + priceTraffic;
                }
                else if (daysCount > 1) {
                    proxyAllPriceInUsd = ((proxyAllPriceInUsd / 4) * 1.4) + priceTraffic;
                }
                /* ----- Day pricing ----- */
                proxyAllPriceInUsd = proxyAllPriceInUsd + addService;
                /* ----- Service ----- */
                if (service && service != 'overall') {
                    proxyAllPriceInUsd += 1;
                }
                /* ----- Service ----- */
                /* ----- Ip Score ----- */
                if (ipScore >= 70) {
                    proxyAllPriceInUsd = proxyAllPriceInUsd * 1.25;
                }
                /* ----- Ip Score ----- */
            }
            else {
                if (proxyFor == "private") {
                    oneProxyPriceInUsd = (1 / 29) * daysCount;
                }
                if (version > 1 && proxyFor != "private" && proxyCount < 100) {
                    oneProxyPriceInUsd = oneProxyPriceInUsd * (Math.max(1, (Math.max(1, 50 - proxyCount) / 20)));
                }
                if (daysCount < 20) {
                    oneProxyPriceInUsd = oneProxyPriceInUsd + (((10 - daysCount) / 1000) / 40);
                }
                if (proxyCount <= 50 && daysCount <= 20) {
                    oneProxyPriceInUsd = oneProxyPriceInUsd * (Math.max(1, (Math.max(1, 70 - proxyCount) / 25)));
                }
                if (proxyCount >= 200 && daysCount <= 20) {
                    oneProxyPriceInUsd = oneProxyPriceInUsd / (Math.min((daysCount > 8 ? 1.1 : 1.3), Math.max(1, Math.max(1, proxyCount - 199) / 25)));
                }
                if (daysCount <= 10) {
                    oneProxyPriceInUsd = oneProxyPriceInUsd * 1.5;
                }
                if (daysCount <= 16) {
                    oneProxyPriceInUsd = oneProxyPriceInUsd / 1.35;
                }
                if (daysCount <= 10 && proxyCount > 70) {
                    oneProxyPriceInUsd = oneProxyPriceInUsd * 1.4;
                }
                if (daysCount <= 16 && proxyCount > 70) {
                    oneProxyPriceInUsd = oneProxyPriceInUsd * 2.3;
                }
                if (daysCount >= 10 && daysCount <= 20) {
                    oneProxyPriceInUsd = oneProxyPriceInUsd * 1.2;
                }
                if (daysCount > 350) {
                    oneProxyPriceInUsd = oneProxyPriceInUsd * 0.90;
                }
                proxyAllPriceInUsd = proxyCount * oneProxyPriceInUsd;
                if (version > 1 && (trafficInGb > 90 || trafficInGb <= 0) && proxyCount < 100) {
                    proxyAllPriceInUsd += 1 * Math.max(daysCount / 29, 1);
                }
                if (version > 1 && (trafficInGb > 190 || trafficInGb <= 0)) {
                    proxyAllPriceInUsd += 1.2 * Math.max(daysCount / 29, 1);
                }
                if (version > 1 && (trafficInGb > 390 || trafficInGb <= 0)) {
                    proxyAllPriceInUsd += 1.5 * Math.max(daysCount / 29, 1);
                }
                if (version > 1 && (trafficInGb > 700 || trafficInGb <= 0)) {
                    proxyAllPriceInUsd += 4 * Math.max(daysCount / 29, 1);
                }
                if (version > 1 && trafficInGb <= 0) {
                    proxyAllPriceInUsd += 30 * Math.max(daysCount / 29, 1);
                }
                if (version > 5 && trafficInGb <= 0) {
                    proxyAllPriceInUsd += Math.max(10, ((proxyCount / 100) * 1.2)) * Math.max(daysCount / 29, 1);
                }
                if (version > 5 && trafficInGb >= 400) {
                    proxyAllPriceInUsd += (Math.max(1, ((proxyCount / 100) * 1.2)) * Math.max(daysCount / 29, 1) / 1.1);
                }
                if (version > 5 && trafficInGb >= 800) {
                    proxyAllPriceInUsd += (Math.max(1, ((proxyCount / 100) * 1.2)) * Math.max(daysCount / 29, 1) / 1.2);
                }
                if (version > 15 && trafficInGb <= 0) {
                    proxyAllPriceInUsd += proxyAllPriceInUsd * 0.3;
                }
            }
        }
        if (!isResidential && !isMobile && version <= 20) {
            if (!isRandomProxy) {
                proxyAllPriceInUsd += 0.85;
            }
            if (version > 4 && !isRandomProxy) {
                proxyAllPriceInUsd += 0.15;
            }
        }
        var proxyAllPriceInUsdWithSale = proxyAllPriceInUsd / salePercentage;
        var saleAmountInUSD = proxyAllPriceInUsd - proxyAllPriceInUsdWithSale;
        proxyAllPriceInUsd = proxyAllPriceInUsd - saleAmountInUSD;
        if (addedUSDToPerDay > 0) {
            proxyAllPriceInUsd += addedUSDToPerDay * daysCount;
        }
        if (hasUnlimitedIps) {
            if (isPayAsGo) {
                proxyAllPriceInUsd += 1;
            }
            if (isMobile) {
                proxyAllPriceInUsd += 1;
            }
            else {
                proxyAllPriceInUsd += 2;
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
            'saleAmount': CalcUtils.round(Math.abs(saleAmountInUSD) * this.currencyRates.get(currency), 2)
            /* Added in 1.3 */
        });
    };
    return Calculator;
}());
exports.default = Calculator;
