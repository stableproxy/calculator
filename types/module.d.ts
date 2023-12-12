interface LangPhases
{
	[key: string]: {
		uk?: string;
		en?: string;
		ru?: string;
	};
}

declare class Lang
{
	private phases;
	private locale;

	constructor(phases?: LangPhases, locale?: string);

	get(key: string, args?: any[], locale?: string): string;
}

declare class CalcUtils
{
	static isNumeric(value: any): boolean;

	static round(num: number, dec?: number): number;

	static convertStorageUnit(size: number, fromUnit: string, toUnit: string, linux?: boolean): number;

	static addMonthsDate(date: Date, months: number): Date;

	static convertTimeUnit(value: number, from: string, to: string): number;
}

declare class CurrencyRates
{
	private rates;

	constructor(rates?: {
		[key: string]: number;
	});

	get(currency: string): number;

	format(value: number, currency: string): string;
}

interface PackageOrderOptions
{
	id?: number | null;
	count?: number;
	traffic_amount?: number;
	traffic_unit?: string;
	period_amount?: number;
	period_unit?: string;
	countries?: string[];
	currency?: string;
	added_price_per_day?: number;
	type?: string;
	has_unlimited_auth_ips?: boolean;
	user_id?: number;
	already_spent_in_usd?: number;
	version?: number;
}

declare class PackageOrder
{
	id: number | null;
	count: number;
	traffic_amount: number;
	traffic_unit: string;
	period_amount: number;
	period_unit: string;
	countries: string[];
	currency: string;
	added_price_per_day: number;
	type: string;
	has_unlimited_auth_ips: boolean;
	user_id: number;
	already_spent_in_usd: number;
	version: number;

	constructor(options?: PackageOrderOptions);

	get traffic_in_gb(): number;

	get pay_for_setup(): boolean;

	get period_days(): number;

	getRenewPrices(calculator: Calculator, currency?: string | null): CalculatorOutput;

	getPrices(calculator: Calculator, currency?: string | null): CalculatorOutput;
}

interface CalculatorInputOptions
{
	currencyOrOptions?: string | {
		[key: string]: any;
	};
	proxyCount?: number;
	daysCount?: number;
	isRandomProxy?: boolean;
	addedUSDToPerDay?: number;
	proxyFor?: string;
	hasUnlimitedIps?: boolean;
	version?: number;
	trafficInGb?: number;
	ownerId?: number;
}

declare class CalculatorInput
{
	currency: string;
	proxyCount: number;
	daysCount: number;
	isRandomProxy: boolean;
	addedUSDToPerDay: number;
	proxyFor: string;
	hasUnlimitedIps: boolean;
	version: number;
	trafficInGb: number;
	ownerId: number;

	constructor(currencyOrOptions?: string | {
		[key: string]: any;
	}, proxyCount?: number, daysCount?: number, isRandomProxy?: boolean, addedUSDToPerDay?: number, proxyFor?: string, hasUnlimitedIps?: boolean, version?: number, trafficInGb?: number, ownerId?: number);
}

interface CalculatorOutputOptions
{
	overall?: number;
	oneProxy?: number;
	overallFormatted?: string;
	oneProxyFormatted?: string;
	overallUSD?: number;
	oneProxyUSD?: number;
	overallFormattedUSD?: string;
	oneProxyFormattedUSD?: string;
	version?: number;
	currency?: string;
	salePercentage?: number;
	saleAmountUSD?: number;
	saleAmount?: number;
}

declare class CalculatorOutput
{
	overall: number | null;
	oneProxy: number | null;
	overallFormatted: string | null;
	oneProxyFormatted: string | null;
	overallUSD: number | null;
	oneProxyUSD: number | null;
	overallFormattedUSD: string | null;
	oneProxyFormattedUSD: string | null;
	version: number | null;
	currency: string | null;
	salePercentage: number | null;
	saleAmountUSD: number | null;
	saleAmount: number | null;

	constructor(options: CalculatorOutputOptions);
}

declare class Calculator
{
	private currencyRates;
	private lang;
	private userIdFetch;
	private salePercentageFetch;
	private localeFetch;

	constructor(
		userIdFetch?: () => number,
		salePercentageFetch?: () => number | null,
		localeFetch?: () => string | null
	);

	getLocale(): string;

	phase(key: string, args?: any[], locale?: string): string;

	getSalePercentage(): number | null;

	getUserId(): number | null;

	isLogged(): boolean;

	calculate(options: CalculatorInput): CalculatorOutput;
}

export default Calculator;
export {CalculatorInput, CurrencyRates, CalcUtils, PackageOrder};
