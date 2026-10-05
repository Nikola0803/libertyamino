import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/catalog";
import { getShopListProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = getShopListProducts(await getCatalogProducts());
  return NextResponse.json({ products, syncedAt: new Date().toISOString() }, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
