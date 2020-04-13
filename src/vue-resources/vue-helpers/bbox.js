export default function bbox(selector) {
  try {
    const target = this.$el.querySelector(selector);
    const box = target.getBBox();
    return Object.assign(box, {
      get top() {
        return box.y;
      },
      get left() {
        return box.x;
      },
      get bottom() {
        return box.top + box.height;
      },
      get right() {
        return box.left + box.width;
      }
    });
  }
  catch (e) {
    return {}
  }
}
