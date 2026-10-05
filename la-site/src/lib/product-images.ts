import type { Product } from "./types";

const GENERATED_ROOT = "/images/products/generated-v1";

const GENERATED_IMAGE_BY_SLUG: Record<string, string> = {
  "5-amino-1mq-50mg": "5-amino-1mq-50mg.png",
  "aod-9604-10mg": "aod-9604-10mg.png",
  "bacteriostatic-water-30ml": "bacteriostatic-water-30ml.png",
  "bpc-157-5mg": "bpc-157-5mg.png",
  "bpc-157-10mg": "bpc-157-10mg.png",
  "bpc-157-20mg": "bpc-157-20mg.png",
  "bpc-tb-500-blend-10mg": "bpc-157-tb-500-blend-10mg.png",
  "bpc-tb-500-blend-20mg": "bpc-157-tb-500-blend-20mg.png",
  "bpc-157-tb-500-blend-10mg": "bpc-157-tb-500-blend-10mg.png",
  "bpc-157-tb-500-blend-20mg": "bpc-157-tb-500-blend-20mg.png",
  "cartalax-20mg": "cartalax-20mg.png",
  "cjc-1295-no-dac-5mg": "cjc-1295-no-dac-5mg.png",
  "cjc-1295-without-dac-5mg": "cjc-1295-no-dac-5mg.png",
  "cjc-ipa-blend-10mg": "cjc-1295-ipamorelin-10mg.png",
  "cjc-ipa-blend-20mg": "cjc-1295-ipamorelin-20mg.png",
  "cjc-1295-ipamorelin-10mg": "cjc-1295-ipamorelin-10mg.png",
  "cjc-1295-ipamorelin-20mg": "cjc-1295-ipamorelin-20mg.png",
  "evlv-1-5mg": "evlv-1-5mg.png",
  "evlv-1-10mg": "evlv-1-10mg.png",
  "evlv-2-10mg": "evlv-2-10mg.png",
  "evlv-2-15mg": "evlv-2-15mg.png",
  "evlv-2-30mg": "evlv-2-30mg.png",
  "evlv-2-60mg": "evlv-2-60mg.png",
  "evlv-3-10mg": "evlv-3-10mg.png",
  "evlv-3-15mg": "evlv-3-15mg.png",
  "evlv-3-30mg": "evlv-3-30mg.png",
  "evlv-3-60mg": "evlv-3-60mg.png",
  "ghk-cu-50mg": "ghk-cu-50mg.png",
  "glow-70mg": "glow-70mg.png",
  "hcg-2000iu": "hcg-2000iu.png",
  "hcg-5000iu": "hcg-5000iu.png",
  "igf-1-lr3-1mg": "igf-1-lr3-1mg.png",
  "klow-80mg": "klow-80mg.png",
  "kpv-10mg": "kpv-10mg.png",
  "kpv-oral-500mcg": "kpv-oral-500mcg-tablets-white.png",
  "korean-pink-glutathione-1200mg": "korean-pink-glutathione-1200mg.png",
  "melanotan-ii-10mg": "melanotan-ii-10mg.png",
  "mots-c-10mg": "mots-c-10mg.png",
  "mots-c-40mg": "mots-c-40mg.png",
  "nad-500mg": "nad-plus-500mg.png",
  "nad-plus-500mg": "nad-plus-500mg.png",
  "oxytocin-10mg": "oxytocin-10mg.png",
  "pt-141-10mg": "pt-141-10mg.png",
  "selank-10mg": "selank-10mg.png",
  "semax-10mg": "semax-10mg.png",
  "ss-31-10mg": "ss-31-10mg.png",
  "tb-500-5mg": "tb-500-5mg.png",
  "tb-500-10mg": "tb-500-10mg.png",
  "tb-500-20mg": "tb-500-20mg.png",
  "tesamorelin-10mg": "tesamorelin-10mg.png",
  "tesamorelin-20mg": "tesamorelin-20mg.png",
  "thymosin-alpha-1-5mg": "thymosin-alpha-1-5mg.png",
};

function generatedPath(filename: string) {
  return `${GENERATED_ROOT}/${filename}`;
}

function normalizedProductKey(value: string) {
  return value
    .toLowerCase()
    .replace(/\+/g, "-plus-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getGeneratedProductImage(product: Pick<Product, "slug" | "name">) {
  const filename =
    GENERATED_IMAGE_BY_SLUG[product.slug] ||
    GENERATED_IMAGE_BY_SLUG[normalizedProductKey(product.name)];
  return filename ? generatedPath(filename) : undefined;
}

export function getProductImage(product: Pick<Product, "slug" | "name" | "image">) {
  return getGeneratedProductImage(product) || product.image || "/images/certified/evlv-glp3r.png";
}
