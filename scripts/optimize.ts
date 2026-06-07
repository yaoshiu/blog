import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'path';
import sharp from 'sharp';

const files = process.argv.slice(2);

async function processImg() {
  const imgExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const imgFiles = files.filter((file) =>
    imgExts.includes(path.extname(file).toLowerCase()),
  );

  console.log(`${imgFiles.length} files found, processing...`);

  const reps = [];

  for (const img of imgFiles) {
    const dir = path.dirname(img);
    const base = path.basename(img);
    const newBase = `${base}.avif`;
    const newImg = path.join(dir, newBase);

    try {
      await sharp(img).avif({ quality: 65 }).toFile(newImg);
      fs.unlinkSync(img);
      execSync(`git add ${newImg}`);
      reps.push({ old: base, new: newBase });
    } catch (err) {
      console.error(`converting ${img} error`);
    }
  }

  const codeExts = [
    '.astro',
    '.md',
    '.mdx',
    '.json',
    '.js',
    '.ts',
    '.tsx',
    '.jsx',
    '.css',
    '.svelte',
    '.html',
  ];
  const codeFiles = files.filter((file) =>
    codeExts.includes(path.extname(file).toLowerCase()),
  );

  for (const code of codeFiles) {
    let content = fs.readFileSync(code, 'utf-8');
    let changed = false;

    for (const rep of reps) {
      if (content.includes(rep.old)) {
        content = content.replaceAll(rep.old, rep.new);
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(code, content, 'utf-8');
      console.log(`${code} updated`);
    }
  }
}

processImg().catch(console.error);
