export default function imageInfo(url, mime) {
  return new Promise(function(resolve, reject) {
    const img = new Image();
    img.src = url;
    img.addEventListener("load", function() {
      resolve({
        data: url,
        width: img.width,
        height: img.height,
        ratio: img.width / img.height
      });
    });
  });
}
