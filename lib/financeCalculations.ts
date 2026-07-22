export type PaymentFrequency = "weekly" | "monthly" | "yearly";

export interface LoanInput {
  finalPrice: number;
  depositAmount: number;
  termYears: number;
  interestRate: number; // annual %, e.g. 10 = 10%
  frequency: PaymentFrequency;
}

export interface LoanResult {
  principal: number;
  periodicPayment: number;
  totalPeriods: number;
  totalRepayment: number;
  totalInterest: number;
}

const PERIODS_PER_YEAR: Record<PaymentFrequency, number> = {
  weekly: 52,
  monthly: 12,
  yearly: 1,
};

/**
 * Standard amortizing-loan payment formula:
 * payment = P * r(1+r)^n / ((1+r)^n - 1)
 * where r = periodic interest rate, n = total number of periods.
 */
export function calculateLoanPayment(input: LoanInput): LoanResult {
  const { finalPrice, depositAmount, termYears, interestRate, frequency } =
    input;

  const principal = Math.max(finalPrice - depositAmount, 0);
  const periodsPerYear = PERIODS_PER_YEAR[frequency];
  const totalPeriods = Math.max(Math.round(termYears * periodsPerYear), 1);
  const periodicRate = interestRate / 100 / periodsPerYear;

  let periodicPayment: number;

  if (periodicRate === 0) {
    periodicPayment = principal / totalPeriods;
  } else {
    const factor = Math.pow(1 + periodicRate, totalPeriods);
    periodicPayment = (principal * periodicRate * factor) / (factor - 1);
  }

  // no principal, no payment (avoid -0 / NaN edge cases)
  if (!isFinite(periodicPayment) || principal === 0) {
    periodicPayment = 0;
  }

  const totalRepayment = periodicPayment * totalPeriods;
  const totalInterest = Math.max(totalRepayment - principal, 0);

  return {
    principal,
    periodicPayment,
    totalPeriods,
    totalRepayment,
    totalInterest,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export const FREQUENCY_LABEL: Record<PaymentFrequency, string> = {
  weekly: "week",
  monthly: "month",
  yearly: "year",
};
