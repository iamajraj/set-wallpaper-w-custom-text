import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { exit } from 'process';
import { createInterface } from 'readline';
import { setWallpaper } from 'wallpaper';

const read = createInterface(process.stdin, process.stdout);

const IMAGE_PATH = 'bg.png';

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

  ctx.fillStyle = '#fff';
  ctx.font = '90px Poppins';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas.toBuffer();
}

function saveAsImage(buffer) {
  writeFileSync(IMAGE_PATH, buffer);
}

async function main() {
  const text = await askForText();
  if (!text) return;
  const buffer = await createWallpaper((text ?? '').trim());
  saveAsImage(buffer);
  await setWallpaper(IMAGE_PATH);
  console.log("Let's GO ✨");
  exit(0);
}

main();
