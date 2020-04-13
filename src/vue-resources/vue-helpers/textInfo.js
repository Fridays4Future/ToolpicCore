export default function textInfo(str, style) {

  //console.log(str, style);

  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  for (let propName in style) {
    if (style.hasOwnProperty(propName)) {
      ctx[propName] = style[propName];
    }
  }
  const txt = str;
  const res = ctx.measureText(txt);

  const text = document.createElement("span");

  text.style = `
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    white-space: nowrap;
  `;

  for (let key in style) {
    if (style.hasOwnProperty(key)) {
      text.style[key] = style[key];
    }
  }


  text.innerHTML = str;

  document.body.append(text);

  const bounding = text.getBoundingClientRect();

  const info = {
    width: bounding.width,
    height: bounding.height
  };

  document.body.removeChild(text);

  return info;
}
