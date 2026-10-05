"use client";

/** Shipping address book, stored locally per signed-in user. */

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const STORAGE_KEY = "evlv_addresses";

function readAll(): Address[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeAll(addresses: Address[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  } catch {
    /* ignore */
  }
}

export function getAddressesForUser(userId: string): Address[] {
  return readAll().filter((a) => a.userId === userId);
}

export function addAddress(input: Omit<Address, "id" | "isDefault">): Address {
  const all = readAll();
  const isFirst = !all.some((a) => a.userId === input.userId);
  const address: Address = { ...input, id: `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`, isDefault: isFirst };
  writeAll([...all, address]);
  return address;
}

export function removeAddress(id: string) {
  writeAll(readAll().filter((a) => a.id !== id));
}

export function setDefaultAddress(userId: string, id: string) {
  writeAll(readAll().map((a) => (a.userId === userId ? { ...a, isDefault: a.id === id } : a)));
}
