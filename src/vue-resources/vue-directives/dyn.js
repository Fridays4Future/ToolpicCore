import { getRelElementsPos } from '../../helpers.js'

const dynDirective = {
  // directive definition
  inserted: function (el, binding) {

    dynDirective.update(el, binding);
  },
  update: function (el, binding) {
    el.style.transform = 'scale(0)';

    const originStr = el.getAttributeNS(null, "data-origin");
    try {
      const origin = originStr.split(" ").map(Number);
      const center = getRelElementsPos(el, origin, true);
      el.style.transformOrigin = center.x + 'px ' + center.y + 'px';
    }
    catch (err) {}

    const max = binding.value;
    const bbox = el.getBBox();

    const relations = {
      x: max[0] / bbox.width,
      y: max[1] / bbox.height
    }

    const scale = Math.min(...Object.values(relations));

    el.style.transform = 'scale(' + scale + ')';

  }
}
function boxIsValid(svgRect) {
  return !(svgRect.width == 0 && svgRect.height == 0);
}

export default dynDirective;
