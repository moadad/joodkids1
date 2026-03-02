import * as XLSX from "xlsx";
import { Season, Promo } from "./categories";
import { ProductDoc, ProductImage, SeriesQty } from "./products";

export type ExcelRow = {
  code: number;
  name: string;
  season: Season;
  promo: Promo;
  seriesQty: SeriesQty;
  description?: string;
  imageUrls?: string; // optional, comma-separated
};

const SEASONS: Season[] = ["صيفي", "شتوي", "خريفي"];
const PROMOS: Promo[] = ["عادي", "عرض", "خصم"];
const SERIES: SeriesQty[] = [6, 9, 12];

export function parseExcel(
  file: File
): Promise<{ rows: ExcelRow[]; errors: string[] }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = new Uint8Array(reader.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: "" });

      const errors: string[] = [];
      const rows: ExcelRow[] = [];
      const seenCodes = new Set<number>();

      json.forEach((r, idx) => {
        const rowNum = idx + 2; // header row = 1
        const code = Number(r.code ?? r.Code ?? r.CODE);
        const name = String(r.name ?? r.Name ?? r.NAME ?? "").trim();
        const season = String(r.season ?? r.Season ?? r.SEASON ?? "").trim() as Season;
        const promo = String(r.promo ?? r.Promo ?? r.PROMO ?? "عادي").trim() as Promo;
        const seriesQty = Number(r.seriesQty ?? r.series ?? r.SERIES ?? 6) as SeriesQty;
        const description = String(r.description ?? r.Description ?? "").trim();
        const imageUrls = String(r.imageUrls ?? r.images ?? r.Images ?? "").trim();

        if (!Number.isFinite(code) || code <= 0) {
          errors.push(`Row ${rowNum}: invalid code`);
          return;
        }
        if (seenCodes.has(code)) {
          errors.push(`Row ${rowNum}: duplicate code ${code}`);
          return;
        }
        seenCodes.add(code);

        if (!name) {
          errors.push(`Row ${rowNum}: missing name`);
          return;
        }
        if (!SEASONS.includes(season)) {
          errors.push(`Row ${rowNum}: season must be one of ${SEASONS.join(", ")}`);
          return;
        }
        if (!PROMOS.includes(promo)) {
          errors.push(`Row ${rowNum}: promo must be one of ${PROMOS.join(", ")}`);
          return;
        }
        if (!SERIES.includes(seriesQty)) {
          errors.push(`Row ${rowNum}: seriesQty must be one of ${SERIES.join(", ")}`);
          return;
        }

        rows.push({
          code,
          name,
          season,
          promo,
          seriesQty,
          description: description || undefined,
          imageUrls: imageUrls || undefined,
        });
      });

      resolve({ rows, errors });
    };
    reader.readAsArrayBuffer(file);
  });
}

export function exportProductsToExcel(products: ProductDoc[]) {
  const data = products.map((p) => ({
    code: p.code,
    name: p.name,
    season: p.season,
    promo: p.promo,
    seriesQty: p.seriesQty,
    mainCategory: p.mainCategory,
    description: p.description ?? "",
    imageUrls: p.images?.map((i) => i.url).join(", ") ?? "",
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "products");
  XLSX.writeFile(wb, "products.xlsx");
}

export function toProductDocFromRow(
  row: ExcelRow
): {
  code: number;
  name: string;
  season: Season;
  promo: Promo;
  seriesQty: SeriesQty;
  description?: string;
  images: ProductImage[];
} {
  const images: ProductImage[] = (row.imageUrls ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((url) => ({ url, publicId: "" }));
  return {
    code: row.code,
    name: row.name,
    season: row.season,
    promo: row.promo,
    seriesQty: row.seriesQty,
    description: row.description,
    images,
  };
}
