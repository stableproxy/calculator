(function() {
    class Lang {
        constructor(phases =  {
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
        },
         locale =  'en') {
            this.phases =  phases;
            this.locale =  locale;
        }
        get(key,  args =  [],  locale =  this.locale) {
            if (this.phases[key] &&  this.phases[key]
            [locale]) {
                let phase =  this.phases[key]
                [locale];
                for (let i =  0;
                 i <  args.length;
                 i++) {
                    phase =  phase.replace('{' +  i +  '}',  args[i]);
                }
                return phase;
            }
            return key;
        }
    }
    class CalcUtils {
        /**
	 * @param {*} value
	 * @returns {boolean}
	 */
        static is_empty(value) {
            if (Array.isArray(value)) {
                return value.length ===  0;
            } else
            if (typeof value ===  'object') {
                return Object.keys(value).length ===  0;
            }
            return value ===  undefined ||  value ===  null ||  value ===  '';
        }
        /**
	 * @param {string | number} key
	 * @param {Record<any, any>} array
	 * @returns {boolean}
	 */
        static array_key_exists(key,  array) {
            return key in  array;
        }
        static is_numeric(value) {
            if (
            (undefined ===  value) ||  (null ===  value)) {
                return false;
            }
            if (typeof value ==  'number') {
                return true;
            }
            return ! isNaN(value -  0);
        }
        /**
	 * @param {*} value
	 * @returns {*}
	 */
        static toNumbers(value) {
            if (typeof value ===  'string' &&  value.trim() !==  '' &&  ! isNaN(value)) {
                return Number(value);
            }
            if (value !==  null &&  typeof value ===  'object') {
                const out =  Array.isArray(value) ?  [] :  {};
                for (const key in  value) {
                    out[key] =  CalcUtils.toNumbers(value[key]);
                }
                return out;
            }
            return value;
        }
        static round(num,  dec =  0) {
            let num_sign =  num >=  0 ?  1 :  - 1;

            return parseFloat(
            (Math.round(
            (num *  Math.pow(10,  dec)) +  (num_sign *  0.0001)) /  Math.pow(10,  dec)).toFixed(dec))
        }
        static convertStorageUnit(size,  fromUnit,  toUnit,  linux =  false) {
            const scale =  linux ?  1000 :  1024;
            const unitMap =  {
                tb:  Math.pow(scale,  4),
                gb:  Math.pow(scale,  3),
                mb:  Math.pow(scale,  2),
                kb:  scale,
                b:  1,

            };
            fromUnit =  fromUnit.toLowerCase();
            toUnit =  toUnit.toLowerCase();
            if (! (fromUnit in  unitMap) ||  ! (toUnit in  unitMap)) {
                return size;
            }
            return size *  (unitMap[fromUnit] /  unitMap[toUnit]);
        }
        static addMonthsDate(date,  months) {
            let d =  new Date(date.getTime());
            date.setMonth(date.getMonth() +  + months);
            return date;
        }
        static convertTimeUnit(value,  from,  to) {
            const units =  {
                's':  1,
                'mi':  60,
                'h':  3600,
                'd':  86400,
                'w':  604800,
                'mo':  2592000,
                'y':  31536000,

            };
            const xFrom =  Object.keys(units).find(function (key) {

                return from.startsWith(key);

            });
            const xTo =  Object.keys(units).find(function (key) {

                return to.startsWith(key);

            });
            if (!xFrom ||  ! xTo) {
                return value;
            } // if mo, add months and get diff in seconds

            if (xFrom ===  'mo') {
                let date =  new Date();
                const diff =  Math.floor(
                (this.addMonthsDate(date,  value) -  new Date().getTime()) /  1000) /  units[xTo];
                return Math.trunc(diff);
            }
            return Math.trunc(value *  units[xFrom] /  units[xTo]);
        }
    }
    class CurrencyRates {
        constructor(rates =  {
            USD:  1,
             EUR:  0.87,
             GBP:  0.75,
             PLN:  3.7,
             UAH:  45.59
        }) {
            this.rates =  rates;
        }
        get(currency) {
            return this.rates[currency];
        }
        format(value,  currency) {
            let nf =  null;
            try {
                nf =  Intl.NumberFormat(loc,  {
                    style:  "currency",
                    currencyDisplay:  'narrowSymbol',
                     // MacOS Throws error
                    currency:  currency,

                });
            } catch (e) {
                try {
                    nf =  Intl.NumberFormat(loc,  {
                        style:  "currency",
                        currencyDisplay:  'symbol',
                        currency:  currency,

                    });
                } catch (e) {}
            }
            return nf ?  nf.format(value) :  value +  " " +  currency;
        }
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
    class PackageOrder {

        /**
     * @param {PackageOrderConstructor} [options={}]
     */
        constructor({
            id,
            count,
            traffic_amount,
            traffic_unit,
            period_amount,
            period_unit,
            countries,
            currency,
            added_price_per_day,
            type,
            has_unlimited_auth_ips,
            user_id,
            already_spent_in_usd,
            version,
            isRenew,
            ipScore,
            service,
            bonuses
        } =  {}) {

            /** @type {number | null} */
             this.id =  id ||  null;

            /** @type {number} */
             this.count =  count ||  0;

            /** @type {number} */
             this.traffic_amount =  traffic_amount ||  0;

            /** @type {string} */
             this.traffic_unit =  traffic_unit ||  'gb';

            /** @type {number} */
             this.period_amount =  period_amount ||  0;

            /** @type {string} */
             this.period_unit =  period_unit ||  'days';

            /** @type {Record<string, number>} */
             this.countries =  countries ||  {};

            /** @type {string} */
             this.currency =  currency ||  '';

            /** @type {number} */
             this.added_price_per_day =  added_price_per_day ||  0;

            /** @type {string} */
             this.type =  type ||  '';

            /** @type {boolean} */
             this.has_unlimited_auth_ips =  has_unlimited_auth_ips ||  false;

            /** @type {number} */
             this.user_id =  user_id ||  0;

            /** @type {number} */
             this.already_spent_in_usd =  already_spent_in_usd ||  0;

            /** @type {number} */
             this.version =  version ||  - 1;

            /** @type {number} */
             this.isRenew =  isRenew ||  0;

            /** @type {number} */
             this.ipScore =  ipScore ||  0;

            /** @type {string | null} */
             this.service =  service ||  null;

            /** @type {Record<string, number>} */
             this.bonuses =  bonuses ||  {};
        }
        /**
	 * @returns {number}
	 */
        get traffic_in_gb() {
            return CalcUtils.convertStorageUnit(this.traffic_amount,  this.traffic_unit,  'gb');
        }
        /**
	 * @returns {boolean}
	 */
        get pay_for_setup() {
            return this.type &&  this.type.includes('gb');
        }
        /**
	 * @returns {number}
	 */
        get period_days() {
            return CalcUtils.convertTimeUnit(this.period_amount,  this.period_unit,  'days');
        }
        /**
	 * @param {Calculator} calculator
	 * @param {string} currency
	 * @returns {CalculatorOutput}
	 */
        getRenewPrices(calculator,  currency =  null,  type =  1) {
            return (calculator ||  new Calculator()).calculate(new CalculatorInput(currency ||  this.currency, this.count, this.period_days, (!this.countries ||  Object.keys(this.countries).length ==  0), this.added_price_per_day, this.type, this.has_unlimited_auth_ips, this.version, this.traffic_in_gb, this.user_id, type, this.ipScore, this.service, this.countries, this.bonuses));
        }
        /**
	 * @param {Calculator} calculator
	 * @param {string} currency
	 * @returns {CalculatorOutput}
	 */
        getPrices(calculator,  currency =  null) {
            return (calculator ||  new Calculator()).calculate(new CalculatorInput(currency ||  this.currency, this.count, this.period_days, (!this.countries ||  Object.keys(this.countries).length ==  0) &&  ! this.pay_for_setup, this.added_price_per_day, this.type, this.has_unlimited_auth_ips, this.version, this.traffic_in_gb, this.user_id, 0, this.ipScore, this.service, this.countries, this.bonuses));
        }
    }
    class CalculatorInput {
        constructor(currencyOrOptions =  "USD",  proxyCount =  100,  daysCount =  29,  isRandomProxy =  true,  addedUSDToPerDay =  0,  proxyFor =  "shared",  hasUnlimitedIps =  false,  version =  - 1,  trafficInGb =  25,  ownerId =  - 1,  isRenew =  0,  ipScore =  0,  service =  null,  countries =  {},
         bonuses =  {},
         pricing =  null) {
            const isObject =  currencyOrOptions !==  null &&  typeof currencyOrOptions ===  'object' &&  currencyOrOptions.constructor ===  Object;
            this.currency =  isObject ?  (
            (currencyOrOptions[`currency`] ===  undefined ||  currencyOrOptions[`currency`] ===  null) ?  "USD" :  currencyOrOptions[`currency`]) :  currencyOrOptions;
            this.proxyCount =  isObject ?  (
            (currencyOrOptions[`proxyCount`] ===  undefined ||  currencyOrOptions[`proxyCount`] ===  null) ?  100 :  currencyOrOptions[`proxyCount`]) :  proxyCount;
            this.daysCount =  isObject ?  (
            (currencyOrOptions[`daysCount`] ===  undefined ||  currencyOrOptions[`daysCount`] ===  null) ?  29 :  currencyOrOptions[`daysCount`]) :  daysCount;
            this.isRandomProxy =  isObject ?  (
            (currencyOrOptions[`isRandomProxy`] ===  undefined ||  currencyOrOptions[`isRandomProxy`] ===  null) ?  true :  currencyOrOptions[`isRandomProxy`]) :  isRandomProxy;
            this.addedUSDToPerDay =  isObject ?  (
            (currencyOrOptions[`addedUSDToPerDay`] ===  undefined ||  currencyOrOptions[`addedUSDToPerDay`] ===  null) ?  0 :  currencyOrOptions[`addedUSDToPerDay`]) :  addedUSDToPerDay;
            this.proxyFor =  isObject ?  (
            (currencyOrOptions[`proxyFor`] ===  undefined ||  currencyOrOptions[`proxyFor`] ===  null) ?  "shared" :  currencyOrOptions[`proxyFor`]) :  proxyFor;
            this.hasUnlimitedIps =  isObject ?  (
            (currencyOrOptions[`hasUnlimitedIps`] ===  undefined ||  currencyOrOptions[`hasUnlimitedIps`] ===  null) ?  false :  currencyOrOptions[`hasUnlimitedIps`]) :  hasUnlimitedIps;
            this.version =  isObject ?  (
            (currencyOrOptions[`version`] ===  undefined ||  currencyOrOptions[`version`] ===  null) ?  -  1 :  currencyOrOptions[`version`]) :  version;
            this.trafficInGb =  isObject ?  (
            (currencyOrOptions[`trafficInGb`] ===  undefined ||  currencyOrOptions[`trafficInGb`] ===  null) ?  25 :  currencyOrOptions[`trafficInGb`]) :  trafficInGb;
            this.ownerId =  isObject ?  (
            (currencyOrOptions[`ownerId`] ===  undefined ||  currencyOrOptions[`ownerId`] ===  null) ?  -  1 :  currencyOrOptions[`ownerId`]) :  ownerId;
            this.isRenew =  isObject ?  (
            (currencyOrOptions[`isRenew`] ===  undefined ||  currencyOrOptions[`isRenew`] ===  null) ?  0 :  currencyOrOptions[`isRenew`]) :  isRenew;
            this.ipScore =  isObject ?  (
            (currencyOrOptions[`ipScore`] ===  undefined ||  currencyOrOptions[`ipScore`] ===  null) ?  0 :  currencyOrOptions[`ipScore`]) :  ipScore;
            this.service =  isObject ?  (
            (currencyOrOptions[`service`] ===  undefined ||  currencyOrOptions[`service`] ===  null) ?  null :  currencyOrOptions[`service`]) :  service;
            this.countries =  isObject ?  (
            (currencyOrOptions[`countries`] ===  undefined ||  currencyOrOptions[`countries`] ===  null) ?  {} :  currencyOrOptions[`countries`]) :  countries;
            this.bonuses =  isObject ?  (
            (currencyOrOptions[`bonuses`] ===  undefined ||  currencyOrOptions[`bonuses`] ===  null) ?  {} :  currencyOrOptions[`bonuses`]) :  bonuses;
            this.pricing =  isObject ?  (
            (currencyOrOptions[`pricing`] ===  undefined ||  currencyOrOptions[`pricing`] ===  null) ?  null :  currencyOrOptions[`pricing`]) :  pricing;
        }
    }
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
    class CalculatorOutput {
        constructor(options) {
            /** @type {number} */
            this.overall =  options.overall ||  0;
            /** @type {number} */
            this.oneProxy =  options.oneProxy ||  0;
            /** @type {string} */
            this.overallFormatted =  options.overallFormatted ||  '';
            /** @type {string} */
            this.oneProxyFormatted =  options.oneProxyFormatted ||  '';
            /** @type {number} */
            this.overallUSD =  options.overallUSD ||  0;
            /** @type {number} */
            this.oneProxyUSD =  options.oneProxyUSD ||  0;
            /** @type {string} */
            this.overallFormattedUSD =  options.overallFormattedUSD ||  '';
            /** @type {string} */
            this.oneProxyFormattedUSD =  options.oneProxyFormattedUSD ||  '';
            /** @type {number} */
            this.version =  options.version ||  - 1;
            /** @type {string} */
            this.currency =  options.currency ||  'USD';
            /** @type {number} */
            this.salePercentage =  options.salePercentage ||  1;
            /** @type {number} */
            this.saleAmountUSD =  options.saleAmountUSD ||  0;
            /** @type {number} */
            this.saleAmount =  options.saleAmount ||  0;
            /** @type {Record<string, number>} */
            this.fees =  options.fees ||  {};
            /** @type {Record<string, number>} */
            this.bonuses =  options.bonuses ||  {};
            /** @type {number} */
            this.calc_at =  options.calc_at ||  0;
        }
    }
    class Calculator {
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
        constructor(userIdFetch =  function() {

            return - 1;

        },
         salePercentageFetch =  function() {

            return 1;

        },
         localeFetch =  function() {

            return 'en';

        }) {
            this.currencyRates =  new CurrencyRates();
            this.lang =  new Lang();
            this.pricing =  {
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
            this.userBonuses =  {};
            this.userIdFetch =  userIdFetch;
            this.salePercentageFetch =  salePercentageFetch;
            this.localeFetch =  localeFetch;
        }
        getLocale() {
            return this.localeFetch() ||  'en';
        }
        phase(key,  args =  [],  locale =  this.getLocale()) {
            return this.lang.get(key,  args,  locale);
        }
        getSalePercentage() {
            return this.salePercentageFetch() ||  1;
        }
        getUserId() {
            return this.userIdFetch() ||  - 1;
        }
        isLogged() {
            return this.getUserId() >  0;
        }
        /**
	 * @param {{pricing?: Object, fx?: {rates?: Object<string, (number|string)>}, user?: {sale_divisor?: (number|string), bonuses?: Object<string, (number|string)>}}} catalog
	 * @returns {Calculator}
	 */
        setCatalog(catalog) {
            if (!catalog) {
                return this;
            }
            if (catalog.pricing) {
                this.pricing =  CalcUtils.toNumbers(catalog.pricing);
            }
            if (catalog.fx &&  catalog.fx.rates) {
                this.currencyRates =  new CurrencyRates(CalcUtils.toNumbers(catalog.fx.rates));
            }
            if (catalog.user) {
                const saleDivisor =  Number(catalog.user.sale_divisor) ||  1;
                this.salePercentageFetch =  function () {

                    return saleDivisor;

                };
                this.userBonuses =  CalcUtils.toNumbers(catalog.user.bonuses ||  {});
            }
            return this;
        }
        /**
	 * @returns {Object}
	 */
        getPricing() {
            return this.pricing;
        }
        /**
	 * @param {CalculatorInput} options
	 * @returns {CalculatorOutput}
	 */
        calculate(options) {
            let currency =  options.currency;
            let proxyCount =  options.proxyCount;
            let daysCount =  options.daysCount;
            let isRandomProxy =  options.isRandomProxy;
            let addedUSDToPerDay =  options.addedUSDToPerDay;
            let proxyFor =  options.proxyFor;
            let hasUnlimitedIps =  options.hasUnlimitedIps;
            let version =  options.version;
            let trafficInGb =  options.trafficInGb;
            let ownerId =  options.ownerId;
            let isRenew =  options.isRenew;
            let ipScore =  options.ipScore;
            let service =  options.service;
            let countries =  options.countries;
            let bonuses =  options.bonuses;
            let pricing =  options.pricing;
            if (!bonuses ||  Object.keys(bonuses).length ===  0) {
                 bonuses =  Object.assign({},
                 this.userBonuses);

            } pricing =  pricing ||  this.pricing;
             let myId =  this.isLogged() ?  this.getUserId() :  -  1;
             let fees =  {};
             console.debug(` [SPC]`,  "Renew type is ",  isRenew);

            if (daysCount >  28 &&  daysCount <  32) {
                 daysCount =  29;

            }
            if (version ==  -  1) {
                 version =  32;

            }
            if (ownerId ==  -  1) {
                 ownerId =  myId;

            }
            if (!CalcUtils.is_numeric(trafficInGb)) {
                 trafficInGb =  25;

            } let salePercentage =  myId ==  ownerId ?  this.getSalePercentage() :  1;
             let isPayAsGo =  String.prototype.startsWith.call(proxyFor,  "payasgo");
             let isMobile =  String.prototype.startsWith.call(proxyFor,  "mobile");
             let isResidential =  String.prototype.startsWith.call(proxyFor,  "residential");
             let isDatacenterGb =  String.prototype.endsWith.call(proxyFor,  "datacenter_gb");
             let isMobileRotating =  String.prototype.endsWith.call(proxyFor,  "mobile_rotating_gb");
             let isPayForUsage =  (isPayAsGo ||  isMobile ||  isResidential) &&  (String.prototype.endsWith.call(proxyFor,  "_gb") ||  String.prototype.endsWith.call(proxyFor,  "_requests"));

            if (isResidential ||  isMobile) {
                 salePercentage =  1;

            } let oneProxyPriceInUsd =  0;
             let proxyAllPriceInUsd =  0;
             let gbPrices =  {};
             let hasTierPrice =  false;
             let oneIpPrice =  0;
             let oneGbPrice =  0;
             let ipsPrice =  0;
             let gbsPrice =  0;

            if (isDatacenterGb) {
                 gbPrices =  pricing['per_gb'] ['datacenter_gb'];
                 hasTierPrice =  false;

                for (let tierGbDc of Object.keys(gbPrices)) {

                    if (!hasTierPrice ||  trafficInGb >=  tierGbDc) {
                         oneProxyPriceInUsd =  gbPrices[tierGbDc];
                         hasTierPrice =  true;

                    }
                } proxyAllPriceInUsd =  oneProxyPriceInUsd *  trafficInGb;
                 fees['one_gb'] =  oneProxyPriceInUsd;
                 fees['traffic'] =  proxyAllPriceInUsd;

            }
            else
            if (proxyFor ==  "b2b_our_gb") {
                 oneProxyPriceInUsd =  pricing['b2b_our_gb'] ['per_gb'];
                 proxyAllPriceInUsd =  oneProxyPriceInUsd *  trafficInGb;
                 fees['one_gb'] =  oneProxyPriceInUsd;
                 fees['traffic'] =  proxyAllPriceInUsd;

            }
            else
            if (proxyFor ==  "residential_static_gb") {
                 oneIpPrice =  pricing['residential_static_gb'] ['per_ip'];
                 gbPrices =  pricing['residential_static_gb'] ['per_gb_by_ips'];
                 hasTierPrice =  false;

                for (let tierIpResStatic of Object.keys(gbPrices)) {

                    if (!hasTierPrice ||  proxyCount >=  tierIpResStatic) {
                         oneGbPrice =  gbPrices[tierIpResStatic];
                         hasTierPrice =  true;

                    }
                } ipsPrice =  isRenew >  1 ?  0 :  (proxyCount *  oneIpPrice);
                 gbsPrice =  isRenew ==  1 ?  0 :  (oneGbPrice *  trafficInGb);
                 fees['ip'] =  ipsPrice;
                 fees['one_gb'] =  oneGbPrice;
                 fees['traffic'] =  gbsPrice;
                 oneProxyPriceInUsd =  oneGbPrice;
                 proxyAllPriceInUsd =  ipsPrice +  gbsPrice;

            }
            else
            if (isResidential) {
                 gbPrices =  pricing['per_gb'] ['residential_gb'];
                 hasTierPrice =  false;

                for (let tierGbRes of Object.keys(gbPrices)) {

                    if (!hasTierPrice ||  trafficInGb >=  tierGbRes) {
                         oneProxyPriceInUsd =  gbPrices[tierGbRes];
                         hasTierPrice =  true;

                    }
                } proxyAllPriceInUsd =  oneProxyPriceInUsd *  trafficInGb;
                 fees['one_gb'] =  oneProxyPriceInUsd;
                 fees['traffic'] =  proxyAllPriceInUsd;

            }
            else
            if (isMobileRotating) {
                 gbPrices =  pricing['per_gb'] ['mobile_rotating_gb'];
                 hasTierPrice =  false;

                for (let tierGbMob of Object.keys(gbPrices)) {

                    if (!hasTierPrice ||  trafficInGb >=  tierGbMob) {
                         oneProxyPriceInUsd =  gbPrices[tierGbMob];
                         hasTierPrice =  true;

                    }
                } proxyAllPriceInUsd =  oneProxyPriceInUsd *  trafficInGb;
                 fees['one_gb'] =  oneProxyPriceInUsd;
                 fees['traffic'] =  proxyAllPriceInUsd;

            }
            else
            if (isMobile) {

                if (String.prototype.endsWith.call(proxyFor,  "modem") ||  String.prototype.endsWith.call(proxyFor,  "static")) {
                     oneProxyPriceInUsd =  pricing['mobile_static'] ['beyond'];
                     hasTierPrice =  false;

                    for (let tierDaysStatic of Object.keys(pricing['mobile_static'] ['by_max_days'])) {

                        if (!hasTierPrice &&  daysCount <=  tierDaysStatic) {
                             oneProxyPriceInUsd =  pricing['mobile_static'] ['by_max_days'] [tierDaysStatic];
                             hasTierPrice =  true;

                        }
                    } proxyAllPriceInUsd =  oneProxyPriceInUsd *  proxyCount;

                    if (daysCount >  pricing['mobile_static'] ['year'] ['over_days']) {
                         proxyAllPriceInUsd =  proxyAllPriceInUsd *  pricing['mobile_static'] ['year'] ['x'];

                    } fees['ip'] =  oneProxyPriceInUsd;

                }
                else
                if (String.prototype.endsWith.call(proxyFor,  "static_gb") ||  proxyFor ==  "mobile_private_gb") {
                     hasTierPrice =  false;

                    for (let tierDaysModem of Object.keys(pricing['mobile_private_gb'] ['by_min_days'])) {

                        if (!hasTierPrice ||  daysCount >=  tierDaysModem) {
                             oneIpPrice =  pricing['mobile_private_gb'] ['by_min_days'] [tierDaysModem] ['per_modem'];
                             oneGbPrice =  pricing['mobile_private_gb'] ['by_min_days'] [tierDaysModem] ['per_gb'];
                             hasTierPrice =  true;

                        }
                    } ipsPrice =  isRenew >  1 ?  0 :  (proxyCount *  oneIpPrice);
                     gbsPrice =  isRenew ==  1 ?  0 :  (oneGbPrice *  trafficInGb);
                     oneProxyPriceInUsd =  oneGbPrice;
                     proxyAllPriceInUsd =  ipsPrice +  gbsPrice;
                     fees['ip'] =  ipsPrice;
                     fees['one_gb'] =  oneGbPrice;
                     fees['traffic'] =  gbsPrice;

                }
                else {
                     gbPrices =  pricing['per_gb'] ['mobile_shared_gb'];
                     hasTierPrice =  false;

                    for (let tierGbMobShared of Object.keys(gbPrices)) {

                        if (!hasTierPrice ||  trafficInGb >=  tierGbMobShared) {
                             oneProxyPriceInUsd =  gbPrices[tierGbMobShared];
                             hasTierPrice =  true;

                        }
                    } proxyAllPriceInUsd =  oneProxyPriceInUsd *  trafficInGb;
                     fees['one_gb'] =  oneProxyPriceInUsd;
                     fees['traffic'] =  proxyAllPriceInUsd;

                }
            }
            else
            if (isPayAsGo) {
                 oneProxyPriceInUsd =  pricing['payasgo'] ['flat'];
                 proxyAllPriceInUsd =  pricing['payasgo'] ['flat'];

            }
            else {

                if (isRenew ==  4) {
                     oneProxyPriceInUsd =  0;
                     proxyAllPriceInUsd =  pricing['ip_packages'] ['traffic_once'] ['below_first'];

                    for (let tierTrafficOnce of Object.keys(pricing['ip_packages'] ['traffic_once'] ['steps'])) {

                        if (trafficInGb >=  tierTrafficOnce) {
                             proxyAllPriceInUsd =  pricing['ip_packages'] ['traffic_once'] ['steps'] [tierTrafficOnce];

                        }
                    } fees['traffic'] =  proxyAllPriceInUsd;
                     salePercentage =  1;

                }
                else
                if (version >=  30) {
                     let priceTraffic =  0;
                     oneProxyPriceInUsd =  0;
                     let addService =  0;
                     let discount =  0;
                     let defaultProxy =  false;
                     let addPercentageOne =  1;

                    if (proxyFor ==  "private" ||  proxyFor ==  "shared") {
                         oneProxyPriceInUsd =  pricing[proxyFor] ['per_ip'];
                         defaultProxy =  true;
                         addPercentageOne =  pricing[proxyFor] ['small_order'] ['pct_per_missing_ip'] *  (pricing[proxyFor] ['small_order'] ['below'] -  proxyCount);

                    } let isSmallCount =  defaultProxy &&  proxyCount <  pricing[proxyFor] ['small_order'] ['below'];

                    if (isSmallCount) {
                         console.debug(` [SPC]`,  "[PRE] Using cheap proxies, orig price: ",  oneProxyPriceInUsd);
                         oneProxyPriceInUsd =  oneProxyPriceInUsd *  (1 +  addPercentageOne /  100);
                         console.debug(` [SPC]`,  "Using cheap proxies ",  addPercentageOne);

                    } let proxyALlPriceInUsdPre =  proxyCount *  oneProxyPriceInUsd;
                     fees['ip'] =  oneProxyPriceInUsd;

                    if (version >=  31 &&  !  isRandomProxy) {
                         let LproxyALlPriceInUsdPre =  0;
                         let typedPriceMultipliers =  pricing['country_multiplier'];
                         let priceMultiplied =  typedPriceMultipliers[proxyFor] ||  [];

                        for (let country of Object.keys(countries)) {
                             let ipMultiple =  priceMultiplied[country] ||  1;
                             let count =  countries[country] ||  0;
                             LproxyALlPriceInUsdPre +=  oneProxyPriceInUsd *  ipMultiple *  count;

                        } console.debug(` [SPC]`,  LproxyALlPriceInUsdPre,  proxyALlPriceInUsdPre);

                        if (LproxyALlPriceInUsdPre >  proxyALlPriceInUsdPre) {
                             fees['countries_specify'] =  LproxyALlPriceInUsdPre -  proxyALlPriceInUsdPre;
                             proxyALlPriceInUsdPre =  LproxyALlPriceInUsdPre;

                        }
                    }
                    if (trafficInGb ==  0) {
                         priceTraffic =  pricing['ip_packages'] ['traffic'] ['unlimited'];

                    }
                    else
                    if (trafficInGb >  pricing['ip_packages'] ['traffic'] ['linear'] ['over_gb']) {
                         priceTraffic =  CalcUtils.round(trafficInGb /  pricing['ip_packages'] ['traffic'] ['linear'] ['gb_per_usd'],  2);

                    }
                    else {

                        if (trafficInGb >  pricing['ip_packages'] ['traffic'] ['base'] ['over_gb']) {
                             priceTraffic =  pricing['ip_packages'] ['traffic'] ['base'] ['usd'];

                        }
                        for (let tierTrafficIp of Object.keys(pricing['ip_packages'] ['traffic'] ['steps'])) {

                            if (trafficInGb >=  tierTrafficIp) {
                                 priceTraffic =  pricing['ip_packages'] ['traffic'] ['steps'] [tierTrafficIp];

                            }
                        }
                    }
                    if (!isRandomProxy) {
                         addService +=  pricing['ip_packages'] ['fees'] ['countries'];
                         fees['countries'] =  addService;

                    }
                    if (proxyFor ==  'shared' ||  proxyFor ==  'private') {
                         hasTierPrice =  false;

                        for (let tierCountIp of Object.keys(pricing[proxyFor] ['count_multiplier'])) {

                            if (!hasTierPrice ||  proxyCount >=  tierCountIp) {
                                 discount =  pricing[proxyFor] ['count_multiplier'] [tierCountIp];
                                 hasTierPrice =  true;

                            }
                        }
                    } proxyAllPriceInUsd =  (proxyALlPriceInUsdPre) *  discount;
                     fees['ips'] =  proxyALlPriceInUsdPre;
                     let daysPrices =  0;

                    if (daysCount >  pricing['ip_packages'] ['period'] ['year'] ['over_days']) {
                         priceTraffic =  priceTraffic *  pricing['ip_packages'] ['period'] ['year'] ['traffic_x'];
                         daysPrices =  (proxyAllPriceInUsd *  pricing['ip_packages'] ['period'] ['year'] ['ips_x']);

                    }
                    else
                    if (daysCount >  pricing['ip_packages'] ['period'] ['month'] ['over_days'] ||  isSmallCount) {
                         daysPrices =  (proxyAllPriceInUsd *  pricing['ip_packages'] ['period'] ['month'] ['ips_x']);

                    }
                    else
                    if (daysCount >  pricing['ip_packages'] ['period'] ['half'] ['over_days']) {
                         daysPrices =  ( (proxyAllPriceInUsd /  pricing['ip_packages'] ['period'] ['half'] ['ips_div']) *  pricing['ip_packages'] ['period'] ['half'] ['ips_x']);

                    }
                    else
                    if (daysCount >  pricing['ip_packages'] ['period'] ['quarter'] ['over_days']) {
                         daysPrices =  ( (proxyAllPriceInUsd /  pricing['ip_packages'] ['period'] ['quarter'] ['ips_div']) *  pricing['ip_packages'] ['period'] ['quarter'] ['ips_x']);

                    }
                    if (isRenew !=  6) {
                         fees['traffic'] =  priceTraffic;
                         fees['days'] =  daysPrices -  proxyAllPriceInUsd;
                         proxyAllPriceInUsd =  daysPrices +  addService +  priceTraffic;

                    }
                    if (service &&  service !=  'overall') {
                         proxyAllPriceInUsd +=  pricing['ip_packages'] ['fees'] ['geo_service'];
                         fees['geo_service'] =  pricing['ip_packages'] ['fees'] ['geo_service'];

                    }
                    if (ipScore >=  pricing['ip_packages'] ['ip_score'] ['min']) {
                         let scorePrice =  proxyAllPriceInUsd *  pricing['ip_packages'] ['ip_score'] ['x'];
                         fees['ip_score'] =  scorePrice -  proxyAllPriceInUsd;
                         proxyAllPriceInUsd =  scorePrice;

                    }
                }
                else {}
            }
            if (isPayForUsage &&  addedUSDToPerDay >  0) {
                 let oldTrafficPrice =  fees['traffic'] ||  0;
                 let newTrafficPrice =  addedUSDToPerDay *  trafficInGb;
                 fees['one_gb'] =  addedUSDToPerDay;
                 fees['traffic'] =  newTrafficPrice;
                 proxyAllPriceInUsd =  proxyAllPriceInUsd -  oldTrafficPrice +  newTrafficPrice;

            } let proxyAllPriceInUsdWithSale =  proxyAllPriceInUsd /  salePercentage;
             let saleAmountInUSD =  proxyAllPriceInUsd -  proxyAllPriceInUsdWithSale;
             proxyAllPriceInUsd =  proxyAllPriceInUsd -  saleAmountInUSD;
             let overAllBonus =  0;

            for (let type of Object.keys(bonuses)) {
                 let value =  bonuses[type];
                 let withBonusPrice =  0;

                if (type ==  'multiple') {
                     withBonusPrice =  proxyAllPriceInUsd *  value;

                }
                else
                if (type ==  'add') {
                     withBonusPrice =  proxyAllPriceInUsd +  value;

                }
                else
                if (type ==  'percent') {
                     withBonusPrice =  proxyAllPriceInUsd *  value;

                }
                else
                if (type ==  'percent_add') {
                     withBonusPrice =  proxyAllPriceInUsd +  (proxyAllPriceInUsd *  value);

                }
                else {
                     console.debug(` [SPC]`,  "Unknown bonus type");
                     console.debug(` [SPC]`,  type);

                } let diffBonus =  withBonusPrice -  proxyAllPriceInUsd;
                 overAllBonus +=  diffBonus;

            } proxyAllPriceInUsd =  proxyAllPriceInUsd -  overAllBonus;

            if (overAllBonus >  0) {
                 fees['bonus'] =  -  overAllBonus;

            }
            if (addedUSDToPerDay >  0 &&  !  isPayForUsage) {
                 proxyAllPriceInUsd +=  addedUSDToPerDay *  daysCount;

            }
            if (hasUnlimitedIps) {
                 let addUnlimPrice =  0;

                if (isPayAsGo) {
                     addUnlimPrice +=  pricing['unlimited_ips_fee'] ['payasgo'];

                }
                if (isMobile) {
                     addUnlimPrice +=  pricing['unlimited_ips_fee'] ['mobile'];

                }
                else {
                     addUnlimPrice +=  pricing['unlimited_ips_fee'] ['default'];

                }
                if (addUnlimPrice >  0) {
                     fees['unlim_ips'] =  addUnlimPrice;
                     proxyAllPriceInUsd +=  addUnlimPrice;

                }
            } let usdRate =  this.currencyRates.get('USD');
             let currencyRate =  this.currencyRates.get(currency);
             let totalPriceUSD =  CalcUtils.round( (Math.abs(proxyAllPriceInUsd)) *  usdRate,  2);
             let oneProxyPriceUSD =  CalcUtils.round( (Math.abs(oneProxyPriceInUsd)) *  usdRate,  2);
             let totalPrice =  CalcUtils.round( (Math.abs(totalPriceUSD)) *  currencyRate,  2);
             let oneProxyPrice =  CalcUtils.round( (Math.abs(oneProxyPriceUSD)) *  currencyRate,  2);

            if (proxyFor ==  "free") {
                 oneProxyPriceUSD =  0;
                 totalPriceUSD =  0;
                 oneProxyPrice =  0;
                 totalPrice =  0;

            } let total =  this.currencyRates.format(totalPrice,  currency);
             let additional =  this.currencyRates.format(oneProxyPrice,  currency);
             let totalUSD =  this.currencyRates.format(totalPriceUSD,  'USD');
             let additionalUSD =  this.currencyRates.format(oneProxyPriceUSD,  'USD');

            return new CalculatorOutput({
                 'overall':  totalPrice,
                 'oneProxy':  oneProxyPrice,
                 'overallFormatted':  total,
                 'oneProxyFormatted':  additional +  " - " +  (String.prototype.endsWith.call(proxyFor,  '_gb') ?  this.phase("messages.landing.calculator.one-gb-price") :  this.phase("messages.landing.calculator.oneproxyprice")),
                 'overallUSD':  totalPriceUSD,
                 'oneProxyUSD':  oneProxyPriceUSD,
                 'overallFormattedUSD':  totalUSD,
                 'version':  version,
                 'oneProxyFormattedUSD':  additionalUSD +  " - " +  this.phase("messages.landing.calculator.oneproxyprice"),
                 'currency':  currency,
                 'salePercentage':  salePercentage,

                /* Added in 1.2 (from 1.0 to 2.0) */
                 'saleAmountUSD':  CalcUtils.round(Math.abs(saleAmountInUSD),  2),

                /* Added in 1.3 */
                 'saleAmount':  CalcUtils.round(Math.abs(saleAmountInUSD) *  this.currencyRates.get(currency),  2),

                /* Added in 1.3 */
                 'fees':  fees,
                 'bonuses':  bonuses,
                 'calc_at':  Date.now() /  1000,

            });
        }
    }
    window.SP =  window.SP ||  {};
    window.SP.Calculator =  Calculator;
    window.SP.CalculatorInput =  CalculatorInput;
    window.SP.CalculatorOutput =  CalculatorOutput;
    window.SP.CurrencyRates =  CurrencyRates;
    window.SP.CalcUtils =  CalcUtils;
    window.SP.PackageOrder =  PackageOrder;
})
();