import * as THREE from "three";

export function createIconTexture(
  render: () => React.ReactNode,
  size = 128
) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  // High DPI support
  const scale = window.devicePixelRatio || 1;
  canvas.width = size * scale;
  canvas.height = size * scale;
  ctx.scale(scale, scale);

  // Render SVG manually by serializing
  const div = document.createElement("div");
  div.style.width = `${size}px`;
  div.style.height = `${size}px`;
  div.innerHTML = (render() as any).props.children;

  const svg = div.querySelector("svg");
  const data = new XMLSerializer().serializeToString(svg!);

  const img = new Image();
  const texture = new THREE.Texture(canvas);

  img.onload = () => {
    ctx.drawImage(img, 0, 0, size, size);
    texture.needsUpdate = true;
  };

  img.src = `data:image/svg+xml;base64,${btoa(data)}`;

  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return texture;
}