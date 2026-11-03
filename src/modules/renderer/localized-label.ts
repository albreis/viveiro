import { CanvasTexture } from "three";
import { locale } from "../../i18n/runtime.ts";
import { translateSource } from "../../i18n/source.ts";

/** Presentation-only texture; release the locale listener when Three disposes it. */
export function localizedLabelTexture(source: string): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const context = canvas.getContext("2d")!;
  const texture = new CanvasTexture(canvas);
  const draw = () => {
    context.clearRect(0, 0, 256, 64);
    context.fillStyle = "#f5f8e5cc";
    context.beginPath();
    context.roundRect(4, 4, 248, 56, 20);
    context.fill();
    context.font = "500 21px Arial";
    context.fillStyle = "#64754e";
    context.textAlign = "center";
    context.fillText(translateSource(source, locale.locale), 128, 41);
    texture.needsUpdate = true;
  };
  draw();
  const unsubscribe = locale.subscribe(draw);
  texture.addEventListener("dispose", unsubscribe);
  return texture;
}
