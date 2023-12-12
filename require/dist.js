class Lang {
    constructor(phases =  {
        "messages.landing.calculator.one-gb-price": {
            "uk": "\u0426\u0456\u043d\u0430 \u0437\u0430 GB",
            "en": "Price per GB",
            "ru": "\u0426\u0435\u043d\u0430 \u0437\u0430 GB"
        },
        "messages.landing.calculator.oneproxyprice": {
            "uk": "1 \u043f\u0440\u043e\u043a\u0441\u0456",
            "en": "1 proxy",
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
        EUR:  0.91,
         GBP:  0.8,
         UAH:  37.08,
         USD:  1
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
class PackageOrder {
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
        version
    } =  {}) {
        this.id =  id ||  null;
        this.count =  count ||  0;
        this.traffic_amount =  traffic_amount ||  0;
        this.traffic_unit =  traffic_unit ||  'gb';
        this.period_amount =  period_amount ||  0;
        this.period_unit =  period_unit ||  'days';
        this.countries =  countries ||  [];
        this.currency =  currency ||  '';
        this.added_price_per_day =  added_price_per_day ||  0;
        this.type =  type ||  '';
        this.has_unlimited_auth_ips =  has_unlimited_auth_ips ||  false;
        this.user_id =  user_id ||  0;
        this.already_spent_in_usd =  already_spent_in_usd ||  0;
        this.version =  version ||  - 1;
    }
    get traffic_in_gb() {
        return CalcUtils.convertStorageUnit(this.traffic_amount,  this.traffic_unit,  'gb');
    }
    get pay_for_setup() {
        return this.type &&  this.type.includes('gb');
    }
    get period_days() {
        return CalcUtils.convertTimeUnit(this.period_amount,  this.period_unit,  'days');
    }
    getRenewPrices(calculator,  currency =  null) {
        return (calculator ||  new Calculator()).calculate(new CalculatorInput(currency ||  this.currency, this.count, this.period_days, (!this.countries ||  Object.keys(this.countries).length ==  0), this.added_price_per_day, this.type, this.has_unlimited_auth_ips, this.version, this.traffic_in_gb, this.user_id));
    }
    getPrices(calculator,  currency =  null) {
        return (calculator ||  new Calculator()).calculate(new CalculatorInput(currency ||  this.currency, this.count, this.period_days, (!this.countries ||  Object.keys(this.countries).length ==  0) &&  ! this.pay_for_setup, this.added_price_per_day, this.type, this.has_unlimited_auth_ips, this.version, this.traffic_in_gb, this.user_id));
    }
}
class CalculatorInput {
    constructor(currencyOrOptions =  "USD",  proxyCount =  100,  daysCount =  29,  isRandomProxy =  true,  addedUSDToPerDay =  0,  proxyFor =  "shared",  hasUnlimitedIps =  false,  version =  - 1,  trafficInGb =  25,  ownerId =  - 1) {
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
    }
}
class CalculatorOutput {
    constructor(options) {
        this.overall =  options.overall ||  null;
        this.oneProxy =  options.oneProxy ||  null;
        this.overallFormatted =  options.overallFormatted ||  null;
        this.oneProxyFormatted =  options.oneProxyFormatted ||  null;
        this.overallUSD =  options.overallUSD ||  null;
        this.oneProxyUSD =  options.oneProxyUSD ||  null;
        this.overallFormattedUSD =  options.overallFormattedUSD ||  null;
        this.oneProxyFormattedUSD =  options.oneProxyFormattedUSD ||  null;
        this.version =  options.version ||  null;
        this.currency =  options.currency ||  null;
        this.salePercentage =  options.salePercentage ||  null;
        this.saleAmountUSD =  options.saleAmountUSD ||  null;
        this.saleAmount =  options.saleAmount ||  null;
    }
}
class Calculator {
    constructor(userIdFetch =  function() {

        return - 1;

    },
     salePercentageFetch =  function() {

        return null;

    },
     localeFetch =  function() {

        return null;

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
         let myId =  this.isLogged() ?  this.getUserId() :  -  1;

        if (version ==  -  1) {
             version =  20;

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
         let oneProxyPriceInUsd =  ( (0.03 *  3) /  29) *  daysCount;
         let proxyAllPriceInUsd =  1;

        if (isResidential) {
             let gbPrices =  {
                 "1":  1.5,
                 "5":  1.45,
                 "25":  1.4,
                 "50":  1.27
            };
             oneProxyPriceInUsd =  gbPrices[trafficInGb] ||  100;
             proxyAllPriceInUsd =  oneProxyPriceInUsd *  trafficInGb;

        }
        else
        if (isMobile) {

            if (String.prototype.endsWith.call(proxyFor,  "modem") ||  String.prototype.endsWith.call(proxyFor,  "static")) {

                if (daysCount <=  3) {
                     oneProxyPriceInUsd =  4;

                }
                else
                if (daysCount >=  3 &&  daysCount <=  18) {
                     oneProxyPriceInUsd =  15;

                }
                else {
                     oneProxyPriceInUsd =  40;

                } proxyAllPriceInUsd =  oneProxyPriceInUsd *  proxyCount;

                if (daysCount >  35) {
                     proxyAllPriceInUsd =  proxyAllPriceInUsd *  11;

                }
            }
            else {
                 oneProxyPriceInUsd =  1;;
                 proxyAllPriceInUsd =  oneProxyPriceInUsd *  proxyCount;

            }
        }
        else
        if (isPayAsGo) {
             oneProxyPriceInUsd =  1;
             proxyAllPriceInUsd =  1;

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
                 oneProxyPriceInUsd =  oneProxyPriceInUsd *  0.85;

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
        if (!isRandomProxy) {
             proxyAllPriceInUsd +=  0.85;

        }
        if (version >  4 &&  !  isRandomProxy) {
             proxyAllPriceInUsd +=  0.15;

        } let proxyAllPriceInUsdWithSale =  proxyAllPriceInUsd /  salePercentage;
         let saleAmountInUSD =  proxyAllPriceInUsd -  proxyAllPriceInUsdWithSale;
         proxyAllPriceInUsd =  proxyAllPriceInUsdWithSale;

        if (addedUSDToPerDay >  0) {
             proxyAllPriceInUsd +=  addedUSDToPerDay *  daysCount;

        }
        if (hasUnlimitedIps) {

            if (isPayAsGo) {
                 proxyAllPriceInUsd +=  1;

            }
            if (isMobile) {
                 proxyAllPriceInUsd +=  1;

            }
            else {
                 proxyAllPriceInUsd +=  4;

            }
        } let usdRate =  this.currencyRates.get('USD');
         let currencyRate =  this.currencyRates.get(currency);
         let totalPriceUSD =  CalcUtils.round( (Math.abs(proxyAllPriceInUsd)) *  usdRate,  2);
         let oneProxyPriceUSD =  CalcUtils.round( (Math.abs(oneProxyPriceInUsd)) *  usdRate,  2);
         let totalPrice =  CalcUtils.round( (Math.abs(totalPriceUSD)) *  currencyRate,  2);
         let oneProxyPrice =  CalcUtils.round( (Math.abs(oneProxyPriceUSD)) *  currencyRate,  2);
         let total =  this.currencyRates.format(totalPrice,  currency);
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
             'saleAmount':  CalcUtils.round(Math.abs(saleAmountInUSD) *  this.currencyRates.get(currency),  2)
            /* Added in 1.3 */

        });
    }
}
module.exports =  {
    Calculator,
    CalculatorInput,
    CurrencyRates,
    CalcUtils,
    PackageOrder
};