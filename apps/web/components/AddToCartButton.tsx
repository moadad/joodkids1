"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { ProductDoc } from "@/lib/products";
import SeriesQtyModal from "@/components/SeriesQtyModal";

export default function AddToCartButton({ product }: { product: ProductDoc }) {
  const { addWithCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="jk-btn jk-btn-primary"
      >
        إضافة للسلة
      </button>

      <SeriesQtyModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={(seriesCount) => {
          addWithCount(product, seriesCount);
          setOpen(false);
        }}
        productName={product.name}
        seriesQty={product.seriesQty}
      />
    </>
  );
}
