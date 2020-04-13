import { imageInfo } from "../vue-helpers/__index.js"
import { getRelElementsPos, clearElement, copyAttrributesSVG } from '../../helpers.js'

const __svgNamespace = "http://www.w3.org/2000/svg";

const scaleImageDirective = {
  inserted: async function(el, binding) {

    scaleImageDirective.update(el, binding);

  },
  update: async function(el, binding) {
    const { value } = binding;
    const box = el.getBBox();

    const ratio = box.width / box.height;

    const src = el.getAttributeNS("http://www.w3.org/1999/xlink", "href");
    const img = await imageInfo(src);

    const cutting = new Map([
      [false, {
        side: 'width',
        axis: 'x'
      }],
      [true, {
        side: 'height',
        axis: 'y'
      }]
    ]).get(ratio >= img.ratio);

    const scale = Math.max(ratio, img.ratio) / Math.min(ratio, img.ratio);

    const offset = (scale - 1) * box[cutting.side];
    const offsetPerSide = offset / 2;
    const translate = {
      x: 0,
      y: 0
    }
    const offsetPerSideRel = offsetPerSide / scale;
    translate[cutting.axis] = offsetPerSideRel * value;

    const center = getRelElementsPos(el, [0.5, 0.5], true);
    el.style.transformOrigin = center.x + 'px ' + center.y + 'px';

    if (scale) {
      el.style.transform = 'scale(' + (scale) + ') translate(' + translate.x + 'px, ' + translate.y + 'px)';
    }

  }
};

export default scaleImageDirective;
