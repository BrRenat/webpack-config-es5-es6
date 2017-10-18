const loadImage = url => new Promise((resolve, reject) => {
  const image = new Image()
  image.onload = function () {
    resolve({
      width: image.width,
      height: image.height,
      url,
    })
  }
  image.onerror = reject
  image.src = url

  setTimeout(() => {
    image.src = ''
  }, 30 * 1000)
})

export default loadImage
