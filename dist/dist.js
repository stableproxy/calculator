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
    function CalculatorInput(Wd3f5edb97_b976_a6f7c, ude483a2af_2afe_62036, Se40443e3f_e3fa_c738c, Ed1462699d_99d6_bfbf4, k882124820_8203_98d56, G00a595152_1525_d2cf4, p20c205e33_e337_3e81e, f586215647_6472_c38d1, w341ee2a2c_a2c3_d95b7, Fbb4ce3280_2803_e64ad, r577b9ed7e_d7ed_adac9, t5c9e6f994_9947_17340, P780bb5cc7_cc77_e7ee9, p8c6882226_2260_4c979, ra57bb1a97_a974_46cf2) {
        if (Wd3f5edb97_b976_a6f7c === void 0) { Wd3f5edb97_b976_a6f7c = "USD"; }
        if (ude483a2af_2afe_62036 === void 0) { ude483a2af_2afe_62036 = 100; }
        if (Se40443e3f_e3fa_c738c === void 0) { Se40443e3f_e3fa_c738c = 29; }
        if (Ed1462699d_99d6_bfbf4 === void 0) { Ed1462699d_99d6_bfbf4 = true; }
        if (k882124820_8203_98d56 === void 0) { k882124820_8203_98d56 = 0; }
        if (G00a595152_1525_d2cf4 === void 0) { G00a595152_1525_d2cf4 = "shared"; }
        if (p20c205e33_e337_3e81e === void 0) { p20c205e33_e337_3e81e = false; }
        if (f586215647_6472_c38d1 === void 0) { f586215647_6472_c38d1 = -1; }
        if (w341ee2a2c_a2c3_d95b7 === void 0) { w341ee2a2c_a2c3_d95b7 = 25; }
        if (Fbb4ce3280_2803_e64ad === void 0) { Fbb4ce3280_2803_e64ad = -1; }
        if (r577b9ed7e_d7ed_adac9 === void 0) { r577b9ed7e_d7ed_adac9 = 0; }
        if (t5c9e6f994_9947_17340 === void 0) { t5c9e6f994_9947_17340 = 0; }
        if (P780bb5cc7_cc77_e7ee9 === void 0) { P780bb5cc7_cc77_e7ee9 = null; }
        if (p8c6882226_2260_4c979 === void 0) { p8c6882226_2260_4c979 = []; }
        if (ra57bb1a97_a974_46cf2 === void 0) { ra57bb1a97_a974_46cf2 = {}; }
        var isObject = Wd3f5edb97_b976_a6f7c !== null && typeof Wd3f5edb97_b976_a6f7c === 'object' && Wd3f5edb97_b976_a6f7c.constructor === Object;
        this.Wd3f5edb97_b976_a6f7c = isObject ? (Wd3f5edb97_b976_a6f7c["Wd3f5edb97_b976_a6f7c"] || "USD") : Wd3f5edb97_b976_a6f7c;
        this.ude483a2af_2afe_62036 = isObject ? (Wd3f5edb97_b976_a6f7c["ude483a2af_2afe_62036"] || 100) : ude483a2af_2afe_62036;
        this.Se40443e3f_e3fa_c738c = isObject ? (Wd3f5edb97_b976_a6f7c["Se40443e3f_e3fa_c738c"] || 29) : Se40443e3f_e3fa_c738c;
        this.Ed1462699d_99d6_bfbf4 = isObject ? (Wd3f5edb97_b976_a6f7c["Ed1462699d_99d6_bfbf4"] || true) : Ed1462699d_99d6_bfbf4;
        this.k882124820_8203_98d56 = isObject ? (Wd3f5edb97_b976_a6f7c["k882124820_8203_98d56"] || 0) : k882124820_8203_98d56;
        this.G00a595152_1525_d2cf4 = isObject ? (Wd3f5edb97_b976_a6f7c["G00a595152_1525_d2cf4"] || "shared") : G00a595152_1525_d2cf4;
        this.p20c205e33_e337_3e81e = isObject ? (Wd3f5edb97_b976_a6f7c["p20c205e33_e337_3e81e"] || false) : p20c205e33_e337_3e81e;
        this.f586215647_6472_c38d1 = isObject ? (Wd3f5edb97_b976_a6f7c["f586215647_6472_c38d1"] || -1) : f586215647_6472_c38d1;
        this.w341ee2a2c_a2c3_d95b7 = isObject ? (Wd3f5edb97_b976_a6f7c["w341ee2a2c_a2c3_d95b7"] || 25) : w341ee2a2c_a2c3_d95b7;
        this.Fbb4ce3280_2803_e64ad = isObject ? (Wd3f5edb97_b976_a6f7c["Fbb4ce3280_2803_e64ad"] || -1) : Fbb4ce3280_2803_e64ad;
        this.r577b9ed7e_d7ed_adac9 = isObject ? (Wd3f5edb97_b976_a6f7c["r577b9ed7e_d7ed_adac9"] || 0) : r577b9ed7e_d7ed_adac9;
        this.t5c9e6f994_9947_17340 = isObject ? (Wd3f5edb97_b976_a6f7c["t5c9e6f994_9947_17340"] || 0) : t5c9e6f994_9947_17340;
        this.P780bb5cc7_cc77_e7ee9 = isObject ? (Wd3f5edb97_b976_a6f7c["P780bb5cc7_cc77_e7ee9"] || null) : P780bb5cc7_cc77_e7ee9;
        this.p8c6882226_2260_4c979 = isObject ? (Wd3f5edb97_b976_a6f7c["p8c6882226_2260_4c979"] || []) : p8c6882226_2260_4c979;
        this.ra57bb1a97_a974_46cf2 = isObject ? (Wd3f5edb97_b976_a6f7c["ra57bb1a97_a974_46cf2"] || {}) : ra57bb1a97_a974_46cf2;
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
        var Wd3f5edb97_b976_a6f7c = options.Wd3f5edb97_b976_a6f7c;
        var ude483a2af_2afe_62036 = options.ude483a2af_2afe_62036;
        var Se40443e3f_e3fa_c738c = options.Se40443e3f_e3fa_c738c;
        var Ed1462699d_99d6_bfbf4 = options.Ed1462699d_99d6_bfbf4;
        var k882124820_8203_98d56 = options.k882124820_8203_98d56;
        var G00a595152_1525_d2cf4 = options.G00a595152_1525_d2cf4;
        var p20c205e33_e337_3e81e = options.p20c205e33_e337_3e81e;
        var f586215647_6472_c38d1 = options.f586215647_6472_c38d1;
        var w341ee2a2c_a2c3_d95b7 = options.w341ee2a2c_a2c3_d95b7;
        var Fbb4ce3280_2803_e64ad = options.Fbb4ce3280_2803_e64ad;
        var r577b9ed7e_d7ed_adac9 = options.r577b9ed7e_d7ed_adac9;
        var t5c9e6f994_9947_17340 = options.t5c9e6f994_9947_17340;
        var P780bb5cc7_cc77_e7ee9 = options.P780bb5cc7_cc77_e7ee9;
        var p8c6882226_2260_4c979 = options.p8c6882226_2260_4c979;
        var ra57bb1a97_a974_46cf2 = options.ra57bb1a97_a974_46cf2;
        var nc05027808_8085_ec410 = this.isLogged() ? this.getUserId() : -1;
        var n6bc31fc47_c473_03907 = {};
        console.debug(" [SPC]", "Renew type is ", r577b9ed7e_d7ed_adac9);
        if (Se40443e3f_e3fa_c738c > 28 && Se40443e3f_e3fa_c738c < 32) {
            Se40443e3f_e3fa_c738c = 29;
        }
        if (f586215647_6472_c38d1 == -1) {
            f586215647_6472_c38d1 = 32;
        }
        if (Fbb4ce3280_2803_e64ad == -1) {
            Fbb4ce3280_2803_e64ad = nc05027808_8085_ec410;
        }
        if (!CalcUtils.is_numeric(w341ee2a2c_a2c3_d95b7)) {
            w341ee2a2c_a2c3_d95b7 = 25;
        }
        var t764a18caf_cafc_3763a = nc05027808_8085_ec410 == Fbb4ce3280_2803_e64ad ? this.getSalePercentage() : 1;
        var M51d8da6c9_6c93_54078 = String.prototype.startsWith.call(G00a595152_1525_d2cf4, "payasgo");
        var f9fe167ace_aced_6adc0 = String.prototype.startsWith.call(G00a595152_1525_d2cf4, "mobile");
        var hf2d637a54_a548_31f09 = String.prototype.startsWith.call(G00a595152_1525_d2cf4, "residential");
        if (hf2d637a54_a548_31f09 || f9fe167ace_aced_6adc0) {
            t764a18caf_cafc_3763a = 1;
        }
        var fb8775e1c8_1c82_ff25e = ((0.03 * 3) / 29) * Se40443e3f_e3fa_c738c;
        var i6da966b4f_b4f8_8f8b5 = 1;
        if (G00a595152_1525_d2cf4 == "residential_static_gb") {
            var G36ab98b4c_b4c5_0154a = 2;
            var x368e3efc3_fc3b_a13b6 = 3;
            if (f586215647_6472_c38d1 >= 32) {
                G36ab98b4c_b4c5_0154a = 2;
                x368e3efc3_fc3b_a13b6 = 1;
            }
            var ica339a93d_93d6_30a33 = r577b9ed7e_d7ed_adac9 > 1 ? 0 : (ude483a2af_2afe_62036 * G36ab98b4c_b4c5_0154a);
            var V8bade3f4e_f4e3_88a61 = r577b9ed7e_d7ed_adac9 == 1 ? 0 : (x368e3efc3_fc3b_a13b6 * w341ee2a2c_a2c3_d95b7);
            n6bc31fc47_c473_03907['ip'] = ica339a93d_93d6_30a33;
            n6bc31fc47_c473_03907['one_gb'] = x368e3efc3_fc3b_a13b6;
            n6bc31fc47_c473_03907['traffic'] = V8bade3f4e_f4e3_88a61;
            fb8775e1c8_1c82_ff25e = x368e3efc3_fc3b_a13b6;
            i6da966b4f_b4f8_8f8b5 = ica339a93d_93d6_30a33 + V8bade3f4e_f4e3_88a61;
        }
        else if (hf2d637a54_a548_31f09) {
            var Ve37e8b3c6_3c62_4f7f6 = {
                "1": 1.65,
                "5": 1.6,
                "25": 1.55,
                "50": 1.5
            };
            fb8775e1c8_1c82_ff25e = Ve37e8b3c6_3c62_4f7f6[w341ee2a2c_a2c3_d95b7] || 100;
            i6da966b4f_b4f8_8f8b5 = fb8775e1c8_1c82_ff25e * w341ee2a2c_a2c3_d95b7;
            n6bc31fc47_c473_03907['one_gb'] = fb8775e1c8_1c82_ff25e;
            n6bc31fc47_c473_03907['traffic'] = i6da966b4f_b4f8_8f8b5;
        }
        else if (f9fe167ace_aced_6adc0) {
            if (String.prototype.endsWith.call(G00a595152_1525_d2cf4, "modem") || String.prototype.endsWith.call(G00a595152_1525_d2cf4, "static")) {
                if (Se40443e3f_e3fa_c738c <= 3) {
                    fb8775e1c8_1c82_ff25e = 4.2;
                }
                else if (Se40443e3f_e3fa_c738c >= 3 && Se40443e3f_e3fa_c738c <= 18) {
                    fb8775e1c8_1c82_ff25e = 16.8;
                }
                else {
                    fb8775e1c8_1c82_ff25e = 25.2;
                }
                i6da966b4f_b4f8_8f8b5 = fb8775e1c8_1c82_ff25e * ude483a2af_2afe_62036;
                if (Se40443e3f_e3fa_c738c > 35) {
                    i6da966b4f_b4f8_8f8b5 = i6da966b4f_b4f8_8f8b5 * 11;
                }
                n6bc31fc47_c473_03907['ip'] = fb8775e1c8_1c82_ff25e;
            }
            else if (String.prototype.endsWith.call(G00a595152_1525_d2cf4, "static_gb")) {
                x368e3efc3_fc3b_a13b6 = 0.5;
                G36ab98b4c_b4c5_0154a = 20;
                if (Se40443e3f_e3fa_c738c <= 3) {
                    G36ab98b4c_b4c5_0154a = 3;
                    x368e3efc3_fc3b_a13b6 = 1;
                }
                else if (Se40443e3f_e3fa_c738c >= 3 && Se40443e3f_e3fa_c738c <= 18) {
                    G36ab98b4c_b4c5_0154a = 12;
                    x368e3efc3_fc3b_a13b6 = 0.75;
                }
                ica339a93d_93d6_30a33 = r577b9ed7e_d7ed_adac9 > 1 ? 0 : (ude483a2af_2afe_62036 * G36ab98b4c_b4c5_0154a);
                V8bade3f4e_f4e3_88a61 = r577b9ed7e_d7ed_adac9 == 1 ? 0 : (x368e3efc3_fc3b_a13b6 * w341ee2a2c_a2c3_d95b7);
                fb8775e1c8_1c82_ff25e = x368e3efc3_fc3b_a13b6;
                i6da966b4f_b4f8_8f8b5 = ica339a93d_93d6_30a33 + V8bade3f4e_f4e3_88a61;
                n6bc31fc47_c473_03907['ip'] = ica339a93d_93d6_30a33;
                n6bc31fc47_c473_03907['one_gb'] = x368e3efc3_fc3b_a13b6;
                n6bc31fc47_c473_03907['traffic'] = V8bade3f4e_f4e3_88a61;
            }
            else {
                fb8775e1c8_1c82_ff25e = 0.85;
                i6da966b4f_b4f8_8f8b5 = fb8775e1c8_1c82_ff25e * ude483a2af_2afe_62036;
                n6bc31fc47_c473_03907['one_gb'] = fb8775e1c8_1c82_ff25e;
                n6bc31fc47_c473_03907['traffic'] = i6da966b4f_b4f8_8f8b5;
            }
        }
        else if (M51d8da6c9_6c93_54078) {
            fb8775e1c8_1c82_ff25e = 1;
            i6da966b4f_b4f8_8f8b5 = 1;
        }
        else {
            /* Traffic additional */
            if (r577b9ed7e_d7ed_adac9 == 4) {
                /*
 * 25гб 0,5
    100гб 1,25
    400гб 5
    800 10
 */
                fb8775e1c8_1c82_ff25e = 0;
                if (w341ee2a2c_a2c3_d95b7 >= 4000) {
                    i6da966b4f_b4f8_8f8b5 = 50;
                }
                else if (w341ee2a2c_a2c3_d95b7 >= 800) {
                    i6da966b4f_b4f8_8f8b5 = 10;
                }
                else if (w341ee2a2c_a2c3_d95b7 >= 400) {
                    i6da966b4f_b4f8_8f8b5 = 5;
                }
                else if (w341ee2a2c_a2c3_d95b7 >= 100) {
                    i6da966b4f_b4f8_8f8b5 = 1.25;
                }
                else if (w341ee2a2c_a2c3_d95b7 >= 25) {
                    i6da966b4f_b4f8_8f8b5 = 0.5;
                }
                n6bc31fc47_c473_03907['traffic'] = i6da966b4f_b4f8_8f8b5;
                t764a18caf_cafc_3763a = 1;
            }
            else if (f586215647_6472_c38d1 >= 30) {
                var h40ff1dfa9_fa9e_b75e2 = 0;
                fb8775e1c8_1c82_ff25e = 0;
                var fbc344d333_3334_43aa1 = 0;
                var r245f102fb_2fb7_cdaef = 0;
                /* ----- Count ----- */
                if (G00a595152_1525_d2cf4 == "private") {
                    fb8775e1c8_1c82_ff25e = 0.9;
                }
                else if (G00a595152_1525_d2cf4 == "shared") {
                    fb8775e1c8_1c82_ff25e = 0.08;
                }
                var f35e217a61_a619_27f2c = ude483a2af_2afe_62036 * fb8775e1c8_1c82_ff25e;
                n6bc31fc47_c473_03907['ip'] = fb8775e1c8_1c82_ff25e;
                if (f586215647_6472_c38d1 >= 31 && !Ed1462699d_99d6_bfbf4) {
                    var p174eb5e70_e705_8472c = 0;
                    var P3768dead4_ad43_1a9b7 = {
                        "shared": {
                            "UA": 2
                        },
                        "private": []
                    };
                    var d268b3d700_700c_3047c = P3768dead4_ad43_1a9b7[G00a595152_1525_d2cf4] || [];
                    // for on p8c6882226_2260_4c979
                    for (var _i = 0, _a = Object.keys(p8c6882226_2260_4c979); _i < _a.length; _i++) {
                        var C379b90ed6_ed6a_7976b = _a[_i];
                        var b3c86488fe_8fe8_575e6 = d268b3d700_700c_3047c[C379b90ed6_ed6a_7976b] || 1;
                        var x0eadee2e1_2e1a_fba87 = p8c6882226_2260_4c979[C379b90ed6_ed6a_7976b] || 0;
                        p174eb5e70_e705_8472c += fb8775e1c8_1c82_ff25e * b3c86488fe_8fe8_575e6 * x0eadee2e1_2e1a_fba87;
                    }
                    console.debug(" [SPC]", p174eb5e70_e705_8472c, f35e217a61_a619_27f2c);
                    if (p174eb5e70_e705_8472c > f35e217a61_a619_27f2c) {
                        n6bc31fc47_c473_03907['countries_specify'] = p174eb5e70_e705_8472c - f35e217a61_a619_27f2c;
                        f35e217a61_a619_27f2c = p174eb5e70_e705_8472c;
                    }
                }
                /* ----- Count ----- */
                /* ----- Traffic ----- */
                if (w341ee2a2c_a2c3_d95b7 > 50 && w341ee2a2c_a2c3_d95b7 < 150) {
                    h40ff1dfa9_fa9e_b75e2 = 1;
                }
                else if (w341ee2a2c_a2c3_d95b7 > 150 && w341ee2a2c_a2c3_d95b7 < 250) {
                    h40ff1dfa9_fa9e_b75e2 = 2;
                }
                else if (w341ee2a2c_a2c3_d95b7 > 250 && w341ee2a2c_a2c3_d95b7 < 350) {
                    h40ff1dfa9_fa9e_b75e2 = 3;
                }
                else if (w341ee2a2c_a2c3_d95b7 > 350 && w341ee2a2c_a2c3_d95b7 < 500) {
                    h40ff1dfa9_fa9e_b75e2 = 4;
                }
                else if (w341ee2a2c_a2c3_d95b7 > 4000) {
                    h40ff1dfa9_fa9e_b75e2 = 50;
                }
                else if (w341ee2a2c_a2c3_d95b7 > 500) {
                    h40ff1dfa9_fa9e_b75e2 = 8;
                }
                else if (w341ee2a2c_a2c3_d95b7 == 0) {
                    h40ff1dfa9_fa9e_b75e2 = 50;
                }
                /* ----- Traffic ----- */
                /* ----- Adds ----- */
                if (!Ed1462699d_99d6_bfbf4) {
                    fbc344d333_3334_43aa1 += 1;
                    n6bc31fc47_c473_03907['countries'] = fbc344d333_3334_43aa1;
                }
                /* ----- Adds ----- */
                /* ----- Count discount ----- */
                if (G00a595152_1525_d2cf4 == 'shared') {
                    if (ude483a2af_2afe_62036 < 50) {
                        r245f102fb_2fb7_cdaef = 1.2;
                    }
                    else if (ude483a2af_2afe_62036 < 100) {
                        r245f102fb_2fb7_cdaef = 1.1;
                    }
                    else if (ude483a2af_2afe_62036 < 200) {
                        r245f102fb_2fb7_cdaef = 1;
                    }
                    else if (ude483a2af_2afe_62036 < 500) {
                        r245f102fb_2fb7_cdaef = 0.97;
                    }
                    else if (ude483a2af_2afe_62036 < 1000) {
                        r245f102fb_2fb7_cdaef = 0.95;
                    }
                    else if (ude483a2af_2afe_62036 < 10000) {
                        r245f102fb_2fb7_cdaef = 0.9;
                    }
                }
                else if (G00a595152_1525_d2cf4 == 'private') {
                    if (ude483a2af_2afe_62036 < 50) {
                        r245f102fb_2fb7_cdaef = 1;
                    }
                    else if (ude483a2af_2afe_62036 < 100) {
                        r245f102fb_2fb7_cdaef = 0.97;
                    }
                    else if (ude483a2af_2afe_62036 < 200) {
                        r245f102fb_2fb7_cdaef = 0.95;
                    }
                    else if (ude483a2af_2afe_62036 < 500) {
                        r245f102fb_2fb7_cdaef = 0.9;
                    }
                    else if (ude483a2af_2afe_62036 < 1000) {
                        r245f102fb_2fb7_cdaef = 0.9;
                    }
                    else if (ude483a2af_2afe_62036 < 10000) {
                        r245f102fb_2fb7_cdaef = 0.9;
                    }
                }
                /* ----- Count discount ----- */
                i6da966b4f_b4f8_8f8b5 = (f35e217a61_a619_27f2c) * r245f102fb_2fb7_cdaef;
                n6bc31fc47_c473_03907['ips'] = f35e217a61_a619_27f2c;
                /* ----- Day pricing ----- */
                var a048443fba_fbac_6456e = 0;
                if (Se40443e3f_e3fa_c738c > 33) {
                    h40ff1dfa9_fa9e_b75e2 = h40ff1dfa9_fa9e_b75e2 * 11;
                    a048443fba_fbac_6456e = (i6da966b4f_b4f8_8f8b5 * 11);
                }
                else if (Se40443e3f_e3fa_c738c > 22) {
                    a048443fba_fbac_6456e = (i6da966b4f_b4f8_8f8b5 * 1);
                }
                else if (Se40443e3f_e3fa_c738c > 11) {
                    a048443fba_fbac_6456e = ((i6da966b4f_b4f8_8f8b5 / 2) * 1.2);
                }
                else if (Se40443e3f_e3fa_c738c > 1) {
                    a048443fba_fbac_6456e = ((i6da966b4f_b4f8_8f8b5 / 4) * 1.4);
                }
                /* ----- Day pricing ----- */
                /* - Change ips ignore date - */
                if (r577b9ed7e_d7ed_adac9 != 6) {
                    n6bc31fc47_c473_03907['traffic'] = h40ff1dfa9_fa9e_b75e2;
                    n6bc31fc47_c473_03907['days'] = a048443fba_fbac_6456e - i6da966b4f_b4f8_8f8b5;
                    i6da966b4f_b4f8_8f8b5 = a048443fba_fbac_6456e + fbc344d333_3334_43aa1 + h40ff1dfa9_fa9e_b75e2;
                }
                /* ----- Service ----- */
                if (P780bb5cc7_cc77_e7ee9 && P780bb5cc7_cc77_e7ee9 != 'overall') {
                    i6da966b4f_b4f8_8f8b5 += 1;
                    n6bc31fc47_c473_03907['geo_service'] = 1;
                }
                /* ----- Service ----- */
                /* ----- Ip Score ----- */
                if (t5c9e6f994_9947_17340 >= 70) {
                    var J86eb8ce0c_e0cb_ff4ae = i6da966b4f_b4f8_8f8b5 * 1.25;
                    n6bc31fc47_c473_03907['ip_score'] = J86eb8ce0c_e0cb_ff4ae - i6da966b4f_b4f8_8f8b5;
                    i6da966b4f_b4f8_8f8b5 = J86eb8ce0c_e0cb_ff4ae;
                }
                /* ----- Ip Score ----- */
            }
            else {
                if (G00a595152_1525_d2cf4 == "private") {
                    fb8775e1c8_1c82_ff25e = (1 / 29) * Se40443e3f_e3fa_c738c;
                }
                if (f586215647_6472_c38d1 > 1 && G00a595152_1525_d2cf4 != "private" && ude483a2af_2afe_62036 < 100) {
                    fb8775e1c8_1c82_ff25e = fb8775e1c8_1c82_ff25e * (Math.max(1, (Math.max(1, 50 - ude483a2af_2afe_62036) / 20)));
                }
                if (Se40443e3f_e3fa_c738c < 20) {
                    fb8775e1c8_1c82_ff25e = fb8775e1c8_1c82_ff25e + (((10 - Se40443e3f_e3fa_c738c) / 1000) / 40);
                }
                if (ude483a2af_2afe_62036 <= 50 && Se40443e3f_e3fa_c738c <= 20) {
                    fb8775e1c8_1c82_ff25e = fb8775e1c8_1c82_ff25e * (Math.max(1, (Math.max(1, 70 - ude483a2af_2afe_62036) / 25)));
                }
                if (ude483a2af_2afe_62036 >= 200 && Se40443e3f_e3fa_c738c <= 20) {
                    fb8775e1c8_1c82_ff25e = fb8775e1c8_1c82_ff25e / (Math.min((Se40443e3f_e3fa_c738c > 8 ? 1.1 : 1.3), Math.max(1, Math.max(1, ude483a2af_2afe_62036 - 199) / 25)));
                }
                if (Se40443e3f_e3fa_c738c <= 10) {
                    fb8775e1c8_1c82_ff25e = fb8775e1c8_1c82_ff25e * 1.5;
                }
                if (Se40443e3f_e3fa_c738c <= 16) {
                    fb8775e1c8_1c82_ff25e = fb8775e1c8_1c82_ff25e / 1.35;
                }
                if (Se40443e3f_e3fa_c738c <= 10 && ude483a2af_2afe_62036 > 70) {
                    fb8775e1c8_1c82_ff25e = fb8775e1c8_1c82_ff25e * 1.4;
                }
                if (Se40443e3f_e3fa_c738c <= 16 && ude483a2af_2afe_62036 > 70) {
                    fb8775e1c8_1c82_ff25e = fb8775e1c8_1c82_ff25e * 2.3;
                }
                if (Se40443e3f_e3fa_c738c >= 10 && Se40443e3f_e3fa_c738c <= 20) {
                    fb8775e1c8_1c82_ff25e = fb8775e1c8_1c82_ff25e * 1.2;
                }
                if (Se40443e3f_e3fa_c738c > 350) {
                    fb8775e1c8_1c82_ff25e = fb8775e1c8_1c82_ff25e * 0.90;
                }
                i6da966b4f_b4f8_8f8b5 = ude483a2af_2afe_62036 * fb8775e1c8_1c82_ff25e;
                if (f586215647_6472_c38d1 > 1 && (w341ee2a2c_a2c3_d95b7 > 90 || w341ee2a2c_a2c3_d95b7 <= 0) && ude483a2af_2afe_62036 < 100) {
                    i6da966b4f_b4f8_8f8b5 += 1 * Math.max(Se40443e3f_e3fa_c738c / 29, 1);
                }
                if (f586215647_6472_c38d1 > 1 && (w341ee2a2c_a2c3_d95b7 > 190 || w341ee2a2c_a2c3_d95b7 <= 0)) {
                    i6da966b4f_b4f8_8f8b5 += 1.2 * Math.max(Se40443e3f_e3fa_c738c / 29, 1);
                }
                if (f586215647_6472_c38d1 > 1 && (w341ee2a2c_a2c3_d95b7 > 390 || w341ee2a2c_a2c3_d95b7 <= 0)) {
                    i6da966b4f_b4f8_8f8b5 += 1.5 * Math.max(Se40443e3f_e3fa_c738c / 29, 1);
                }
                if (f586215647_6472_c38d1 > 1 && (w341ee2a2c_a2c3_d95b7 > 700 || w341ee2a2c_a2c3_d95b7 <= 0)) {
                    i6da966b4f_b4f8_8f8b5 += 4 * Math.max(Se40443e3f_e3fa_c738c / 29, 1);
                }
                if (f586215647_6472_c38d1 > 1 && w341ee2a2c_a2c3_d95b7 <= 0) {
                    i6da966b4f_b4f8_8f8b5 += 30 * Math.max(Se40443e3f_e3fa_c738c / 29, 1);
                }
                if (f586215647_6472_c38d1 > 5 && w341ee2a2c_a2c3_d95b7 <= 0) {
                    i6da966b4f_b4f8_8f8b5 += Math.max(10, ((ude483a2af_2afe_62036 / 100) * 1.2)) * Math.max(Se40443e3f_e3fa_c738c / 29, 1);
                }
                if (f586215647_6472_c38d1 > 5 && w341ee2a2c_a2c3_d95b7 >= 400) {
                    i6da966b4f_b4f8_8f8b5 += (Math.max(1, ((ude483a2af_2afe_62036 / 100) * 1.2)) * Math.max(Se40443e3f_e3fa_c738c / 29, 1) / 1.1);
                }
                if (f586215647_6472_c38d1 > 5 && w341ee2a2c_a2c3_d95b7 >= 800) {
                    i6da966b4f_b4f8_8f8b5 += (Math.max(1, ((ude483a2af_2afe_62036 / 100) * 1.2)) * Math.max(Se40443e3f_e3fa_c738c / 29, 1) / 1.2);
                }
                if (f586215647_6472_c38d1 > 15 && w341ee2a2c_a2c3_d95b7 <= 0) {
                    i6da966b4f_b4f8_8f8b5 += i6da966b4f_b4f8_8f8b5 * 0.3;
                }
            }
        }
        if (!hf2d637a54_a548_31f09 && !f9fe167ace_aced_6adc0 && f586215647_6472_c38d1 <= 20) {
            if (!Ed1462699d_99d6_bfbf4) {
                i6da966b4f_b4f8_8f8b5 += 0.85;
            }
            if (f586215647_6472_c38d1 > 4 && !Ed1462699d_99d6_bfbf4) {
                i6da966b4f_b4f8_8f8b5 += 0.15;
            }
        }
        var s6894fe993_993e_56015 = i6da966b4f_b4f8_8f8b5 / t764a18caf_cafc_3763a;
        var Taf3db57f0_7f06_ffc43 = i6da966b4f_b4f8_8f8b5 - s6894fe993_993e_56015;
        i6da966b4f_b4f8_8f8b5 = i6da966b4f_b4f8_8f8b5 - Taf3db57f0_7f06_ffc43;
        var x6f34cfea7_ea71_2d632 = 0;
        for (var _b = 0, _c = Object.keys(ra57bb1a97_a974_46cf2); _b < _c.length; _b++) {
            var Ve2d0cbeb9_eb9c_1594e = _c[_b];
            var dbd4a59761_761f_5c50c = ra57bb1a97_a974_46cf2[Ve2d0cbeb9_eb9c_1594e];
            var c9d0df4da1_da11_40c59 = 0;
            if (Ve2d0cbeb9_eb9c_1594e == 'multiple') {
                c9d0df4da1_da11_40c59 = i6da966b4f_b4f8_8f8b5 * dbd4a59761_761f_5c50c;
            }
            else if (Ve2d0cbeb9_eb9c_1594e == 'add') {
                c9d0df4da1_da11_40c59 = i6da966b4f_b4f8_8f8b5 + dbd4a59761_761f_5c50c;
            }
            else if (Ve2d0cbeb9_eb9c_1594e == 'percent') {
                c9d0df4da1_da11_40c59 = i6da966b4f_b4f8_8f8b5 * dbd4a59761_761f_5c50c;
            }
            else if (Ve2d0cbeb9_eb9c_1594e == 'percent_add') {
                c9d0df4da1_da11_40c59 = i6da966b4f_b4f8_8f8b5 + (i6da966b4f_b4f8_8f8b5 * dbd4a59761_761f_5c50c);
            }
            else {
                console.debug(" [SPC]", "Unknown bonus type");
                console.debug(" [SPC]", Ve2d0cbeb9_eb9c_1594e);
            }
            var g7916f67f4_7f46_c8fff = c9d0df4da1_da11_40c59 - i6da966b4f_b4f8_8f8b5;
            x6f34cfea7_ea71_2d632 += g7916f67f4_7f46_c8fff;
        }
        i6da966b4f_b4f8_8f8b5 = i6da966b4f_b4f8_8f8b5 - x6f34cfea7_ea71_2d632;
        if (x6f34cfea7_ea71_2d632 > 0) {
            n6bc31fc47_c473_03907['bonus'] = -x6f34cfea7_ea71_2d632;
        }
        if (k882124820_8203_98d56 > 0) {
            i6da966b4f_b4f8_8f8b5 += k882124820_8203_98d56 * Se40443e3f_e3fa_c738c;
        }
        if (p20c205e33_e337_3e81e) {
            var h9023d82d7_2d70_39f06 = 0;
            if (M51d8da6c9_6c93_54078) {
                h9023d82d7_2d70_39f06 += 1;
            }
            if (f9fe167ace_aced_6adc0) {
                h9023d82d7_2d70_39f06 += 1;
            }
            else {
                h9023d82d7_2d70_39f06 += 2;
            }
            if (h9023d82d7_2d70_39f06 > 0) {
                n6bc31fc47_c473_03907['unlim_ips'] = h9023d82d7_2d70_39f06;
                i6da966b4f_b4f8_8f8b5 += h9023d82d7_2d70_39f06;
            }
        }
        var c1a14d5ac0_ac01_47943 = this.currencyRates.get('USD');
        var R65f61e95a_95a2_cca19 = this.currencyRates.get(Wd3f5edb97_b976_a6f7c);
        var m9f88b1b85_b850_ba840 = CalcUtils.round((Math.abs(i6da966b4f_b4f8_8f8b5)) * c1a14d5ac0_ac01_47943, 2);
        var ab5d044523_523f_8008b = CalcUtils.round((Math.abs(fb8775e1c8_1c82_ff25e)) * c1a14d5ac0_ac01_47943, 2);
        var iefed6e74e_74e8_578e2 = CalcUtils.round((Math.abs(m9f88b1b85_b850_ba840)) * R65f61e95a_95a2_cca19, 2);
        var b701936d50_d501_ccc16 = CalcUtils.round((Math.abs(ab5d044523_523f_8008b)) * R65f61e95a_95a2_cca19, 2);
        if (G00a595152_1525_d2cf4 == "free") {
            ab5d044523_523f_8008b = 0;
            m9f88b1b85_b850_ba840 = 0;
            b701936d50_d501_ccc16 = 0;
            iefed6e74e_74e8_578e2 = 0;
        }
        var wa1ae8e9ac_9ace_617ea = this.currencyRates.format(iefed6e74e_74e8_578e2, Wd3f5edb97_b976_a6f7c);
        var Gcd0abde46_e46c_35ce9 = this.currencyRates.format(b701936d50_d501_ccc16, Wd3f5edb97_b976_a6f7c);
        var k924537df2_df25_0c6df = this.currencyRates.format(m9f88b1b85_b850_ba840, 'USD');
        var j34f23ad19_d191_b443c = this.currencyRates.format(ab5d044523_523f_8008b, 'USD');
        return new CalculatorOutput({
            'overall': iefed6e74e_74e8_578e2,
            'oneProxy': b701936d50_d501_ccc16,
            'overallFormatted': wa1ae8e9ac_9ace_617ea,
            'oneProxyFormatted': Gcd0abde46_e46c_35ce9 + " - " + (String.prototype.endsWith.call(G00a595152_1525_d2cf4, '_gb') ? this.phase("messages.landing.calculator.one-gb-price") : this.phase("messages.landing.calculator.oneproxyprice")),
            'overallUSD': m9f88b1b85_b850_ba840,
            'oneProxyUSD': ab5d044523_523f_8008b,
            'overallFormattedUSD': k924537df2_df25_0c6df,
            'version': f586215647_6472_c38d1,
            'oneProxyFormattedUSD': j34f23ad19_d191_b443c + " - " + this.phase("messages.landing.calculator.oneproxyprice"),
            'currency': Wd3f5edb97_b976_a6f7c,
            'salePercentage': t764a18caf_cafc_3763a,
            /* Added in 1.2 (from 1.0 to 2.0) */
            'saleAmountUSD': CalcUtils.round(Math.abs(Taf3db57f0_7f06_ffc43), 2),
            /* Added in 1.3 */
            'saleAmount': CalcUtils.round(Math.abs(Taf3db57f0_7f06_ffc43) * this.currencyRates.get(Wd3f5edb97_b976_a6f7c), 2),
            /* Added in 1.3 */
            'fees': n6bc31fc47_c473_03907,
            'bonuses': ra57bb1a97_a974_46cf2,
            'calc_at': Date.now() / 1000,
        });
    };
    return Calculator;
}());
exports.default = Calculator;
