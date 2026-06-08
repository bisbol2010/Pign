/**
 * Client-side thumbnail generation for uploads.
 *
 * - Images are downscaled to a small JPEG.
 * - PDFs are rendered (page 1) to a JPEG via pdf.js.
 *
 * Returns null for unsupported types or any failure; callers should treat a
 * missing thumbnail as "fall back to a type icon".
 */

const THUMB_MAX = 600;
const THUMB_TYPE = "image/jpeg";
const THUMB_QUALITY = 0.8;

export async function generateThumbnail(file: File): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  try {
    if (file.type.startsWith("image/")) {
      return await imageThumbnail(file);
    }
    if (file.type === "application/pdf") {
      return await pdfThumbnail(file);
    }
  } catch (err) {
    console.warn("Thumbnail generation failed:", err);
  }
  return null;
}

function fitScale(width: number, height: number): number {
  const longest = Math.max(width, height);
  return longest > THUMB_MAX ? THUMB_MAX / longest : 1;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), THUMB_TYPE, THUMB_QUALITY)
  );
}

async function imageThumbnail(file: File): Promise<Blob | null> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = fitScale(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await canvasToBlob(canvas);
  } finally {
    bitmap.close();
  }
}

async function pdfThumbnail(file: File): Promise<Blob | null> {
  const pdfjs = await import("pdfjs-dist");
  // Bundler-resolved worker URL (works with Turbopack / webpack 5).
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  try {
    const page = await pdf.getPage(1);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = fitScale(baseViewport.width, baseViewport.height);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport }).promise;
    return await canvasToBlob(canvas);
  } finally {
    await pdf.destroy();
  }
}
