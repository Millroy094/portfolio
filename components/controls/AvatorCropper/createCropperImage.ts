import type { Area } from "react-easy-crop";

type CreateCroppedImageOptions = {
    output?: "jpeg" | "png";
    quality?: number;
    circular?: boolean;
};

export default async function createCroppedImage(
    src: string,
    crop: Area,
    options: CreateCroppedImageOptions = {}
): Promise<File> {
    const { output = "jpeg", quality = 0.92 } = options;

    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.src = src;

    await img.decode().catch(
        () =>
            new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = (e) => reject(e);
            })
    );

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(crop.width);
    canvas.height = Math.round(crop.height);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas context not available");

    ctx.drawImage(
        img,
        Math.round(crop.x),
        Math.round(crop.y),
        Math.round(crop.width),
        Math.round(crop.height),
        0,
        0,
        Math.round(crop.width),
        Math.round(crop.height)
    );

    const mime = output === "jpeg" ? "image/jpeg" : "image/png";

    const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob returned null"))),
            mime,
            quality
        );
    });

    const fileName = output === "jpeg" ? "avatar.jpg" : "avatar.png";
    return new File([blob], fileName, { type: mime });
}