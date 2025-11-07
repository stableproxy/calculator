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
        EUR:  0.92,
         GBP:  0.78,
         UAH:  41.12,
         USD:  1,
         PLN:  3.92
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
     bonuses =  {}) {
        const isObject =  currencyOrOptions !==  null &&  typeof currencyOrOptions ===  'object' &&  currencyOrOptions.constructor ===  Object;
        this.currency =  isObject ?  (currencyOrOptions[`currency`] ||  "USD") :  currencyOrOptions;
        this.proxyCount =  isObject ?  (currencyOrOptions[`proxyCount`] ||  100) :  proxyCount;
        this.daysCount =  isObject ?  (currencyOrOptions[`daysCount`] ||  29) :  daysCount;
        this.isRandomProxy =  isObject ?  (currencyOrOptions[`isRandomProxy`] ||  true) :  isRandomProxy;
        this.addedUSDToPerDay =  isObject ?  (currencyOrOptions[`addedUSDToPerDay`] ||  0) :  addedUSDToPerDay;
        this.proxyFor =  isObject ?  (currencyOrOptions[`proxyFor`] ||  "shared") :  proxyFor;
        this.hasUnlimitedIps =  isObject ?  (currencyOrOptions[`hasUnlimitedIps`] ||  false) :  hasUnlimitedIps;
        this.version =  isObject ?  (currencyOrOptions[`version`] ||  -  1) :  version;
        this.trafficInGb =  isObject ?  (currencyOrOptions[`trafficInGb`] ||  25) :  trafficInGb;
        this.ownerId =  isObject ?  (currencyOrOptions[`ownerId`] ||  -  1) :  ownerId;
        this.isRenew =  isObject ?  (currencyOrOptions[`isRenew`] ||  0) :  isRenew;
        this.ipScore =  isObject ?  (currencyOrOptions[`ipScore`] ||  0) :  ipScore;
        this.service =  isObject ?  (currencyOrOptions[`service`] ||  null) :  service;
        this.countries =  isObject ?  (currencyOrOptions[`countries`] ||  {}) :  countries;
        this.bonuses =  isObject ?  (currencyOrOptions[`bonuses`] ||  {}) :  bonuses;
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

        if (isResidential ||  isMobile) {
             salePercentage =  1;

        } let oneProxyPriceInUsd =  ( (0.03 *  3) /  29) *  daysCount;
         let proxyAllPriceInUsd =  1;

        if (isDatacenterGb) {
             let gbPrices =  {
                 "1":  0.8,
                 "25":  0.75,
                 "100":  0.7,
                 "500":  0.6
            };
             oneProxyPriceInUsd =  gbPrices[trafficInGb] ||  100;
             proxyAllPriceInUsd =  oneProxyPriceInUsd *  trafficInGb;
             fees['one_gb'] =  oneProxyPriceInUsd;
             fees['traffic'] =  proxyAllPriceInUsd;

        }
        else
        if (proxyFor ==  "b2b_our_gb") {
             // pay per gb every gb 2
             oneProxyPriceInUsd =  2;
             proxyAllPriceInUsd =  oneProxyPriceInUsd *  trafficInGb;
             fees['one_gb'] =  oneProxyPriceInUsd;
             fees['traffic'] =  proxyAllPriceInUsd;

        }
        else
        if (proxyFor ==  "residential_static_gb") {
             let oneIpPrice =  2;
             let oneGbPrice =  3;

            if (version >=  32) {
                 oneIpPrice =  2;
                 oneGbPrice =  1;

            } let ipsPrice =  isRenew >  1 ?  0 :  (proxyCount *  oneIpPrice);
             let gbsPrice =  isRenew ==  1 ?  0 :  (oneGbPrice *  trafficInGb);
             fees['ip'] =  ipsPrice;
             fees['one_gb'] =  oneGbPrice;
             fees['traffic'] =  gbsPrice;
             oneProxyPriceInUsd =  oneGbPrice;
             proxyAllPriceInUsd =  ipsPrice +  gbsPrice;

        }
        else
        if (isResidential) {
             gbPrices =  {
                 "1":  1.25,
                 "5":  1.25,
                 "25":  1.2,
                 "50":  1.2
            };
             oneProxyPriceInUsd =  gbPrices[trafficInGb] ||  100;
             proxyAllPriceInUsd =  oneProxyPriceInUsd *  trafficInGb;
             fees['one_gb'] =  oneProxyPriceInUsd;
             fees['traffic'] =  proxyAllPriceInUsd;

        }
        else
        if (isMobileRotating) {
             gbPrices =  {
                 "1":  1.5,
                 "5":  1.4,
                 "25":  1.3,
                 "50":  1.25
            };
             oneProxyPriceInUsd =  gbPrices[trafficInGb] ||  100;
             proxyAllPriceInUsd =  oneProxyPriceInUsd *  trafficInGb;
             fees['one_gb'] =  oneProxyPriceInUsd;
             fees['traffic'] =  proxyAllPriceInUsd;

        }
        else
        if (isMobile) {

            if (String.prototype.endsWith.call(proxyFor,  "modem") ||  String.prototype.endsWith.call(proxyFor,  "static")) {

                if (daysCount <=  3) {
                     oneProxyPriceInUsd =  4.2;

                }
                else
                if (daysCount >=  3 &&  daysCount <=  18) {
                     oneProxyPriceInUsd =  16.8;

                }
                else {
                     oneProxyPriceInUsd =  25.2;

                } proxyAllPriceInUsd =  oneProxyPriceInUsd *  proxyCount;

                if (daysCount >  35) {
                     proxyAllPriceInUsd =  proxyAllPriceInUsd *  11;

                } fees['ip'] =  oneProxyPriceInUsd;

            }
            else
            if (String.prototype.endsWith.call(proxyFor,  "static_gb")) {
                 oneGbPrice =  0.5;
                 oneIpPrice =  20;

                if (daysCount <=  3) {
                     oneIpPrice =  3;
                     oneGbPrice =  1;

                }
                else
                if (daysCount >=  3 &&  daysCount <=  18) {
                     oneIpPrice =  12;
                     oneGbPrice =  0.75;

                } ipsPrice =  isRenew >  1 ?  0 :  (proxyCount *  oneIpPrice);
                 gbsPrice =  isRenew ==  1 ?  0 :  (oneGbPrice *  trafficInGb);
                 oneProxyPriceInUsd =  oneGbPrice;
                 proxyAllPriceInUsd =  ipsPrice +  gbsPrice;
                 fees['ip'] =  ipsPrice;
                 fees['one_gb'] =  oneGbPrice;
                 fees['traffic'] =  gbsPrice;

            }
            else {
                 oneProxyPriceInUsd =  0.85;
                 proxyAllPriceInUsd =  oneProxyPriceInUsd *  proxyCount;
                 fees['one_gb'] =  oneProxyPriceInUsd;
                 fees['traffic'] =  proxyAllPriceInUsd;

            }
        }
        else
        if (isPayAsGo) {
             oneProxyPriceInUsd =  1;
             proxyAllPriceInUsd =  1;

        }
        else {

            /* Traffic additional */

            if (isRenew ==  4) {

                /*
 * 25гб 0,5
	100гб 1,25
	400гб 5
	800 10
 */
                 oneProxyPriceInUsd =  0;

                if (trafficInGb >=  4000) {
                     proxyAllPriceInUsd =  50;

                }
                else
                if (trafficInGb >=  800) {
                     proxyAllPriceInUsd =  10;

                }
                else
                if (trafficInGb >=  400) {
                     proxyAllPriceInUsd =  5;

                }
                else
                if (trafficInGb >=  100) {
                     proxyAllPriceInUsd =  1.25;

                }
                else
                if (trafficInGb >=  25) {
                     proxyAllPriceInUsd =  0.5;

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

                /* ----- Count ----- */

                if (proxyFor ==  "private") {
                     oneProxyPriceInUsd =  0.9;
                     defaultProxy =  true;
                     // add 35%
                     addPercentageOne =  (24 /  5) *  (10 -  proxyCount);

                }
                else
                if (proxyFor ==  "shared") {
                     oneProxyPriceInUsd =  0.08;
                     defaultProxy =  true;
                     // add 40%
                     addPercentageOne =  (60 /  10) *  (10 -  proxyCount);

                } let isSmallCount =  defaultProxy &&  proxyCount <  10;

                if (isSmallCount) {
                     console.debug(` [SPC]`,  "[PRE] Using cheap proxies, orig price: ",  oneProxyPriceInUsd);
                     oneProxyPriceInUsd =  oneProxyPriceInUsd *  (1 +  addPercentageOne /  100);
                     console.debug(` [SPC]`,  "Using cheap proxies ",  addPercentageOne);

                } let proxyALlPriceInUsdPre =  proxyCount *  oneProxyPriceInUsd;
                 fees['ip'] =  oneProxyPriceInUsd;

                if (version >=  31 &&  !  isRandomProxy) {
                     let LproxyALlPriceInUsdPre =  0;
                     let typedPriceMultipliers =  {
                         "shared":  {
                             "UA":  2
                        },
                         "private":  []
                    };
                     let priceMultiplied =  typedPriceMultipliers[proxyFor] ||  [];
                     // for on countries

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
                /* ----- Count ----- */

                /* ----- Traffic ----- */

                if (trafficInGb >  50 &&  trafficInGb <  150) {
                     priceTraffic =  1;

                }
                else
                if (trafficInGb >  150 &&  trafficInGb <  250) {
                     priceTraffic =  2;

                }
                else
                if (trafficInGb >  250 &&  trafficInGb <  350) {
                     priceTraffic =  3;

                }
                else
                if (trafficInGb >  350 &&  trafficInGb <  500) {
                     priceTraffic =  4;

                }
                else
                if (trafficInGb >  4000) {
                     priceTraffic =  50;

                }
                else
                if (trafficInGb >  500) {
                     priceTraffic =  8;

                }
                else
                if (trafficInGb ==  0) {
                     priceTraffic =  50;

                }
                /* ----- Traffic ----- */

                /* ----- Adds ----- */

                if (!isRandomProxy) {
                     addService +=  1;
                     fees['countries'] =  addService;

                }
                /* ----- Adds ----- */

                /* ----- Count discount ----- */

                if (proxyFor ==  'shared') {

                    if (proxyCount <  50) {
                         discount =  1.2;

                    }
                    else
                    if (proxyCount <  100) {
                         discount =  1.1;

                    }
                    else
                    if (proxyCount <  200) {
                         discount =  1;

                    }
                    else
                    if (proxyCount <  500) {
                         discount =  0.97;

                    }
                    else
                    if (proxyCount <  1000) {
                         discount =  0.95;

                    }
                    else
                    if (proxyCount <  10000) {
                         discount =  0.9;

                    }
                }
                else
                if (proxyFor ==  'private') {

                    if (proxyCount <  50) {
                         discount =  1;

                    }
                    else
                    if (proxyCount <  100) {
                         discount =  0.97;

                    }
                    else
                    if (proxyCount <  200) {
                         discount =  0.95;

                    }
                    else
                    if (proxyCount <  500) {
                         discount =  0.9;

                    }
                    else
                    if (proxyCount <  1000) {
                         discount =  0.9;

                    }
                    else
                    if (proxyCount <  10000) {
                         discount =  0.9;

                    }
                }
                /* ----- Count discount ----- */
                 proxyAllPriceInUsd =  (proxyALlPriceInUsdPre) *  discount;
                 fees['ips'] =  proxyALlPriceInUsdPre;

                /* ----- Day pricing ----- */
                 let daysPrices =  0;

                if (daysCount >  33) {
                     priceTraffic =  priceTraffic *  11;
                     daysPrices =  (proxyAllPriceInUsd *  11);

                }
                else
                if (daysCount >  22 ||  isSmallCount) {
                     daysPrices =  (proxyAllPriceInUsd *  1);

                }
                else
                if (daysCount >  11) {
                     daysPrices =  ( (proxyAllPriceInUsd /  2) *  1.2);

                }
                else
                if (daysCount >  1) {
                     daysPrices =  ( (proxyAllPriceInUsd /  4) *  1.4);

                }
                /* ----- Day pricing ----- */

                /* - Change ips ignore date - */

                if (isRenew !=  6) {
                     fees['traffic'] =  priceTraffic;
                     fees['days'] =  daysPrices -  proxyAllPriceInUsd;
                     proxyAllPriceInUsd =  daysPrices +  addService +  priceTraffic;

                }
                /* ----- Service ----- */

                if (service &&  service !=  'overall') {
                     proxyAllPriceInUsd +=  1;
                     fees['geo_service'] =  1;

                }
                /* ----- Service ----- */

                /* ----- Ip Score ----- */

                if (ipScore >=  70) {
                     let scorePrice =  proxyAllPriceInUsd *  1.25;
                     fees['ip_score'] =  scorePrice -  proxyAllPriceInUsd;
                     proxyAllPriceInUsd =  scorePrice;

                }
                /* ----- Ip Score ----- */

            }
            else {

                if (proxyFor ==  "private") {
                     oneProxyPriceInUsd =  (1 /  29) *  daysCount;

                }
                if (version >  1 &&  proxyFor !=  "private" &&  proxyCount <  100) {
                     oneProxyPriceInUsd =  oneProxyPriceInUsd *  (Math.max(1,  (Math.max(1,  50 -  proxyCount) /  20)));

                }
                if (daysCount <  20) {
                     oneProxyPriceInUsd =  oneProxyPriceInUsd +  ( ( (10 -  daysCount) /  1000) /  40);

                }
                if (proxyCount <=  50 &&  daysCount <=  20) {
                     oneProxyPriceInUsd =  oneProxyPriceInUsd *  (Math.max(1,  (Math.max(1,  70 -  proxyCount) /  25)));

                }
                if (proxyCount >=  200 &&  daysCount <=  20) {
                     oneProxyPriceInUsd =  oneProxyPriceInUsd /  (Math.min( (daysCount >  8 ?  1.1 :  1.3),  Math.max(1,  Math.max(1,  proxyCount -  199) /  25)));

                }
                if (daysCount <=  10) {
                     oneProxyPriceInUsd =  oneProxyPriceInUsd *  1.5;

                }
                if (daysCount <=  16) {
                     oneProxyPriceInUsd =  oneProxyPriceInUsd /  1.35;

                }
                if (daysCount <=  10 &&  proxyCount >  70) {
                     oneProxyPriceInUsd =  oneProxyPriceInUsd *  1.4;

                }
                if (daysCount <=  16 &&  proxyCount >  70) {
                     oneProxyPriceInUsd =  oneProxyPriceInUsd *  2.3;

                }
                if (daysCount >=  10 &&  daysCount <=  20) {
                     oneProxyPriceInUsd =  oneProxyPriceInUsd *  1.2;

                }
                if (daysCount >  350) {
                     oneProxyPriceInUsd =  oneProxyPriceInUsd *  0.90;

                } proxyAllPriceInUsd =  proxyCount *  oneProxyPriceInUsd;

                if (version >  1 &&  (trafficInGb >  90 ||  trafficInGb <=  0) &&  proxyCount <  100) {
                     proxyAllPriceInUsd +=  1 *  Math.max(daysCount /  29,  1);

                }
                if (version >  1 &&  (trafficInGb >  190 ||  trafficInGb <=  0)) {
                     proxyAllPriceInUsd +=  1.2 *  Math.max(daysCount /  29,  1);

                }
                if (version >  1 &&  (trafficInGb >  390 ||  trafficInGb <=  0)) {
                     proxyAllPriceInUsd +=  1.5 *  Math.max(daysCount /  29,  1);

                }
                if (version >  1 &&  (trafficInGb >  700 ||  trafficInGb <=  0)) {
                     proxyAllPriceInUsd +=  4 *  Math.max(daysCount /  29,  1);

                }
                if (version >  1 &&  trafficInGb <=  0) {
                     proxyAllPriceInUsd +=  30 *  Math.max(daysCount /  29,  1);

                }
                if (version >  5 &&  trafficInGb <=  0) {
                     proxyAllPriceInUsd +=  Math.max(10,  ( (proxyCount /  100) *  1.2)) *  Math.max(daysCount /  29,  1);

                }
                if (version >  5 &&  trafficInGb >=  400) {
                     proxyAllPriceInUsd +=  (Math.max(1,  ( (proxyCount /  100) *  1.2)) *  Math.max(daysCount /  29,  1) /  1.1);

                }
                if (version >  5 &&  trafficInGb >=  800) {
                     proxyAllPriceInUsd +=  (Math.max(1,  ( (proxyCount /  100) *  1.2)) *  Math.max(daysCount /  29,  1) /  1.2);

                }
                if (version >  15 &&  trafficInGb <=  0) {
                     proxyAllPriceInUsd +=  proxyAllPriceInUsd *  0.3;

                }
            }
        }
        if (!isResidential &&  !  isMobile &&  version <=  20) {

            if (!isRandomProxy) {
                 proxyAllPriceInUsd +=  0.85;

            }
            if (version >  4 &&  !  isRandomProxy) {
                 proxyAllPriceInUsd +=  0.15;

            }
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
        if (addedUSDToPerDay >  0) {
             proxyAllPriceInUsd +=  addedUSDToPerDay *  daysCount;

        }
        if (hasUnlimitedIps) {
             let addUnlimPrice =  0;

            if (isPayAsGo) {
                 addUnlimPrice +=  1;

            }
            if (isMobile) {
                 addUnlimPrice +=  1;

            }
            else {
                 addUnlimPrice +=  2;

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
module.exports =  {
    Calculator,
    CalculatorInput,
    CalculatorOutput,
    CurrencyRates,
    CalcUtils,
    PackageOrder
};