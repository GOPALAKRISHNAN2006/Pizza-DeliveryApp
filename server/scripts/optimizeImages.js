import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INGREDIENTS_DIR = path.resolve(__dirname, "../../client/public/images/ingredients");

async function optimizeImages() {
  console.log("==========================================");
  console.log("🖼️ Starting Image Optimization with Sharp");
  console.log("Directory:", INGREDIENTS_DIR);
  console.log("==========================================");

  if (!fs.existsSync(INGREDIENTS_DIR)) {
    console.error("Ingredients directory not found:", INGREDIENTS_DIR);
    return;
  }

  const files = fs.readdirSync(INGREDIENTS_DIR);
  let totalOriginalSize = 0;
  let totalOptimizedWebpSize = 0;
  let totalOptimizedJpgSize = 0;

  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i) || file.includes("-thumb")) continue;

    const filePath = path.join(INGREDIENTS_DIR, file);
    const parsed = path.parse(filePath);
    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;
    totalOriginalSize += originalSize;

    const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);

    // 1. Generate optimized WebP (max 600px width, quality 80)
    const imageBuffer = fs.readFileSync(filePath);
    const sharpInstance = sharp(imageBuffer);
    const metadata = await sharpInstance.metadata();

    const resizeWidth = metadata.width && metadata.width > 600 ? 600 : undefined;

    const webpBuffer = await sharp(imageBuffer)
      .resize({ width: resizeWidth, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toBuffer();

    fs.writeFileSync(webpPath, webpBuffer);
    const webpSize = webpBuffer.length;
    totalOptimizedWebpSize += webpSize;

    // 2. Also optimize JPG in-place for fallbacks (max 600px width, quality 80, progressive)
    const jpgBuffer = await sharp(imageBuffer)
      .resize({ width: resizeWidth, withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(filePath, jpgBuffer);
    const jpgSize = jpgBuffer.length;
    totalOptimizedJpgSize += jpgSize;

    const reductionPercent = (((originalSize - webpSize) / originalSize) * 100).toFixed(1);
    console.log(
      `✔ ${file} -> ${(originalSize / 1024).toFixed(1)}KB -> WebP: ${(webpSize / 1024).toFixed(1)}KB (-${reductionPercent}%) | JPG: ${(jpgSize / 1024).toFixed(1)}KB`
    );
  }

  console.log("==========================================");
  console.log(`Original total size: ${(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Optimized WebP total: ${(totalOptimizedWebpSize / 1024).toFixed(1)} KB`);
  console.log(`Optimized JPG total: ${(totalOptimizedJpgSize / 1024).toFixed(1)} KB`);
  console.log(
    `🚀 Total Data Savings: ${(
      ((totalOriginalSize - totalOptimizedWebpSize) / totalOriginalSize) *
      100
    ).toFixed(1)}%`
  );
  console.log("==========================================");
}

optimizeImages().catch((err) => {
  console.error("Optimization failed:", err);
});
