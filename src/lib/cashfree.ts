const APP_ID = process.env.CASHFREE_APP_ID ?? "";
const SECRET = process.env.CASHFREE_SECRET_KEY ?? "";
const ENV = (process.env.CASHFREE_ENV ?? "sandbox").toLowerCase();

const BASE_URL =
  ENV === "production" || ENV === "prod"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

export const CASHFREE_MODE =
  ENV === "production" || ENV === "prod" ? "production" : "sandbox";

const API_VERSION = "2023-08-01";

function headers() {
  return {
    "Content-Type": "application/json",
    "x-api-version": API_VERSION,
    "x-client-id": APP_ID,
    "x-client-secret": SECRET,
  };
}

export function cashfreeConfigured() {
  return Boolean(APP_ID && SECRET);
}

export interface CreateOrderInput {
  orderId: string;
  amount: number;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  returnUrl: string;
}

export interface CashfreeOrder {
  order_id: string;
  order_status: string;
  payment_session_id?: string;
  order_amount?: number;
}

export async function createCashfreeOrder(
  input: CreateOrderInput
): Promise<CashfreeOrder> {
  const body = {
    order_id: input.orderId,
    order_amount: input.amount,
    order_currency: "INR",
    customer_details: {
      customer_id: input.customerId,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      customer_email: input.customerEmail || "guest@astro.com",
    },
    order_meta: {
      return_url: input.returnUrl,
    },
  };

  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Cashfree order creation failed");
  }
  return data as CashfreeOrder;
}

export async function getCashfreeOrder(
  orderId: string
): Promise<CashfreeOrder> {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: "GET",
    headers: headers(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Cashfree order fetch failed");
  }
  return data as CashfreeOrder;
}
