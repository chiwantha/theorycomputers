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

export function getTimeSince(createdAt) {
  const created = new Date(createdAt);
  const now = new Date();

  const diffMs = now - created;
  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}Min`;
  }

  if (minutes === 0) {
    return `${hours}H`;
  }

  return `${hours}H ${minutes}Min`;
}
