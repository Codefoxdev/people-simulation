async function loadImage(src, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
  });
}

export { loadImage }