export function getCloudinaryUrl(
  publicId: string | null | undefined,
  cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  transformations?: string
): string | undefined {
  if (!publicId) return undefined;
  if (publicId.startsWith('http')) return publicId;

  const base = `https://res.cloudinary.com/${cloudName}/image/upload`;
  return transformations
    ? `${base}/${transformations}/${publicId}`
    : `${base}/${publicId}`;
}
