export default function isImageCached (src) {
  if (!src) return false

  const image = new Image()
  image.src = src
  return image.complete
}
