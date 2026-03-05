import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function calculateGrnTotal(grn_items) {
  let total = 0;

  for (const item of grn_items) {
    const qty = Number(item.quantity) || 0;
    const cost = Number(item.cost) || 0;

    total += qty * cost;
  }

  return total;
}
