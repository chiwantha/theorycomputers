import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

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

export function generateDocNo() {
  const now = new Date();

  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");

  const datePart = yy + mm;

  const uuidPart = uuidv4().replace(/-/g, "").toUpperCase().slice(0, 4); // 👈 EXACT 4 chars

  return `JOB-${datePart}-${uuidPart}`;
}
