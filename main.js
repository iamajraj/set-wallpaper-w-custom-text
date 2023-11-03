import { createCanvas, Image } from 'canvas';
import { writeFileSync, readdirSync, readdir } from 'fs';
import path, { dirname } from 'path';
import { exit } from 'process';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { setWallpaper } from 'wallpaper';

const read = createInterface(process.stdin, process.stdout);

const OUTPUT_PATH = 'bg.png';

let BG_TEMPLATE = '';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templateDir = 'bg_templates';

async function askForBGTemplate() {
  return new Promise((resolve) => {
    const files = readdirSync(path.join(__dirname, templateDir));
    BG_TEMPLATE = files[0];
    files.forEach((file, i) => {
      console.log(`${i + 1}. ${file}`);
    });
    read.question('[x] Choose bg template? (0 for none) : ', (choice) => {
      choice = Number(choice);
      if (!Number.isNaN(choice)) {
        if (choice === 0) {
          BG_TEMPLATE = '';
          console.log(
            '*No BG template choosen. Proceeding with the BLACK background*'
          );
        } else if (choice > files.length || choice < 0) {
          console.log('*Invalid selection. Proceeding with the DEFAULT one*');
        } else {
          BG_TEMPLATE = files[choice - 1];
        }
      } else {
        console.log(
          '*No option were choosed, Proceeding with the DEFAULT one*'
        );
      }
      resolve();
    });
  });
}

async function askForText() {
  return new Promise((resolve) => {
    read.question("[x] What's next? : ", resolve);
  });
}

async function createWallpaper(text) {
  const canvas = createCanvas(3072, 1296);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#202124';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (BG_TEMPLATE) {
    const bg = new Image();
    bg.src = path.join(__dirname, templateDir, BG_TEMPLATE);
    ctx.drawImage(bg, 0, 0);
  }

  ctx.fillStyle = '#fff';
  ctx.font = '100px Poppins';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas.toBuffer();
}

function saveAsImage(buffer) {
  writeFileSync(OUTPUT_PATH, buffer);
}

async function main() {
  await askForBGTemplate();
  const text = await askForText();
  if (!text) return;
  const buffer = await createWallpaper((text ?? '').trim());
  saveAsImage(buffer);
  await setWallpaper(OUTPUT_PATH);
  console.log("Let's GO ✨");
  exit(0);
}

main();
