"use client";

import React from "react";
import ReactDOMServer from "react-dom/server";
import * as THREE from "three";

export type IconTextureOptions = {
  size?: number;
  iconScale?: number;
  padding?: number;
  bleedPct?: number;
  filters?: {
    min?: THREE.MinificationTextureFilter;
    mag?: THREE.MagnificationTextureFilter;
    mipmaps?: boolean;
  };
};

type TextureWithColorSpace = THREE.Texture & { colorSpace: THREE.ColorSpace };

function setTextureSRGB(texture: THREE.Texture) {
  if ("colorSpace" in texture) {
    (texture as TextureWithColorSpace).colorSpace = THREE.SRGBColorSpace;
  }
}

export function createIconTexture(
  render: () => React.ReactElement,
  { size = 128, iconScale = 0.8, padding = 12, bleedPct = 0.06, filters }: IconTextureOptions = {},
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context not available");

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(size * dpr));
  canvas.height = Math.max(1, Math.floor(size * dpr));
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);

  const svgElement = render();
  let svgMarkup = ReactDOMServer.renderToStaticMarkup(svgElement);
  svgMarkup = prepareSvgMarkup(svgMarkup, bleedPct);

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.decoding = "async";
  img.src = `data:image/svg+xml;base64,${toBase64(svgMarkup)}`;

  const texture = new THREE.Texture(canvas);
  setTextureSRGB(texture);

  const wantMipmaps = filters?.mipmaps ?? true;
  texture.generateMipmaps = wantMipmaps;

  let minFilter: THREE.MinificationTextureFilter =
    filters?.min ?? (wantMipmaps ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter);

  if (!wantMipmaps) {
    const mipmapFilters = new Set<number>([
      THREE.NearestMipMapNearestFilter,
      THREE.NearestMipMapLinearFilter,
      THREE.LinearMipMapNearestFilter,
      THREE.LinearMipmapLinearFilter,
    ]);
    if (mipmapFilters.has(minFilter as unknown as number)) {
      minFilter = THREE.LinearFilter;
    }
  }
  texture.minFilter = minFilter;

  let magFilter = filters?.mag ?? THREE.LinearFilter;
  if (magFilter !== THREE.LinearFilter && magFilter !== THREE.NearestFilter) {
    magFilter = THREE.LinearFilter;
  }
  texture.magFilter = magFilter;

  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  img.onload = () => {
    const vb = getViewBox(svgMarkup);
    const aspect = vb ? vb.vbW / vb.vbH : (img.naturalWidth || 1) / (img.naturalHeight || 1);

    const targetW = Math.max(0, size - padding * 2);
    const targetH = Math.max(0, size - padding * 2);

    let drawW = targetW;
    let drawH = drawW / aspect;
    if (drawH > targetH) {
      drawH = targetH;
      drawW = drawH * aspect;
    }
    drawW *= iconScale;
    drawH *= iconScale;

    const dx = padding + (targetW - drawW) / 2;
    const dy = padding + (targetH - drawH) / 2;

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, dx, dy, drawW, drawH);

    texture.needsUpdate = true;
  };

  img.onerror = (e) => {
    console.error("Failed to load SVG for texture", e, { svg: svgMarkup });
  };

  return texture;
}

/* ----------------------- Helpers ----------------------- */

function prepareSvgMarkup(svgMarkup: string, bleedPct: number): string {
  if (!/<svg[\s>]/i.test(svgMarkup)) {
    throw new Error("Rendered markup does not contain an <svg> root element.");
  }

  let out = svgMarkup.replace(/<svg([^>]*?)>/i, (match, attrs) => {
    const hasXmlns = /xmlns=/.test(attrs);
    const hasXlink = /xmlns:xlink=/.test(attrs);
    const hasPAR = /preserveAspectRatio=/.test(attrs);

    let newAttrs = attrs;
    if (!hasXmlns) newAttrs += ` xmlns="http://www.w3.org/2000/svg"`;
    if (!hasXlink) newAttrs += ` xmlns:xlink="http://www.w3.org/1999/xlink"`;
    if (!hasPAR) newAttrs += ` preserveAspectRatio="xMidYMid meet"`;
    return `<svg${newAttrs}>`;
  });

  const vb = getViewBox(out);
  if (vb) {
    const bleed = Math.max(vb.vbW, vb.vbH) * Math.max(0, bleedPct);
    const vbX = vb.vbX - bleed;
    const vbY = vb.vbY - bleed;
    const vbW = vb.vbW + bleed * 2;
    const vbH = vb.vbH + bleed * 2;

    out = out.replace(/viewBox\s*=\s*["'][^"']*["']/i, `viewBox="${vbX} ${vbY} ${vbW} ${vbH}"`);
  }
  return out;
}

function getViewBox(
  svgMarkup: string,
): { vbX: number; vbY: number; vbW: number; vbH: number } | null {
  const m = svgMarkup.match(
    /viewBox\s*=\s*["']\s*([\-0-9.]+)\s+([\-0-9.]+)\s+([\-0-9.]+)\s+([\-0-9.]+)\s*["']/i,
  );
  if (!m) return null;
  const [, x, y, w, h] = m;
  const vbX = parseFloat(x);
  const vbY = parseFloat(y);
  const vbW = Math.max(0.0001, parseFloat(w));
  const vbH = Math.max(0.0001, parseFloat(h));
  return { vbX, vbY, vbW, vbH };
}

function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}
``;
