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
  const created = new Date(String(createdAt).replace("Z", ""));
  let diffMs = Date.now() - created.getTime();

  if (diffMs < 0) diffMs = 0;

  const totalMinutes = Math.floor(diffMs / 60000);

  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}D ${hours}H`;
  }

  if (hours > 0) {
    return `${hours}H ${minutes}Min`;
  }

  return `${minutes}Min`;
}

export function generateDocNo() {
  const now = new Date();

  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");

  const datePart = yy + mm;

  const uuidPart = uuidv4().replace(/-/g, "").toUpperCase().slice(0, 6); // 👈 EXACT 4 chars

  return `JOB-${datePart}-${uuidPart}`;
}

export function setDivDisabled(divId, disabled) {
  const div = document.getElementById(divId);

  if (!div) return;

  if (disabled) {
    div.style.pointerEvents = "none";
    div.style.opacity = "0.6";
    div.style.userSelect = "none";
  } else {
    div.style.pointerEvents = "auto";
    div.style.opacity = "1";
    div.style.userSelect = "auto";
  }
}

export const calculateWarrantyEndDate = (durationMonths) => {
  const date = new Date();

  date.setMonth(date.getMonth() + durationMonths);

  return date.toISOString().split("T")[0];
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "-";

  const d = new Date(dateString);

  return `${String(d.getUTCDate()).padStart(2, "0")} ${d.toLocaleString("en", {
    month: "short",
    timeZone: "UTC",
  })}, ${String(d.getUTCHours()).padStart(2, "0")}:${String(
    d.getUTCMinutes(),
  ).padStart(2, "0")}`;
};
