<template>
  <g>
    <g v-for="line in lines" v-bind:style="Object.assign(styleObj)">
      <g v-bind:style="{ 'transform-origin': line.center.x + 'px ' + line.center.y + 'px', transform: 'rotate(' + rotates[line.i] + 'deg)' }">
        <rect v-if="background != 'none'" v-bind:x="line.x" v-bind:y="line.y" v-bind:height="line.height" v-bind:width="line.width" v-bind:style="{ fill: background }" v-bind:data-x="line.center.x" v-bind:data-y="line.center.y" />
        <text v-bind:x="line.x + offset[3]" v-bind:y="line.y + offset[0]" style="alignment-baseline: hanging;" letter-spacing="0">
          {{ line.text }}
        </text>
      </g>
    </g>
  </g>
</template>

<script type="text/javascript">
  import { textInfo } from 'VueHelpers';

  export default {
    name: "multiline-text",
    props: ['x', 'y', 'text', 'padding', 'lineheight', 'background', 'css', 'relative', 'align', 'rotate'],
    /*props: {
      x: Number,
      y: Number
    }*/
    data() {
      return {
        a: 100
      }
    },
    computed: {
      rotates() {
        const rotates = this.rotate instanceof Array ? this.rotate : [this.rotate];
        return rotates;
      },
      __lineHeight() {
        return Number(this.lineheight || 1.1);
      },
      relativePos() {
        try {
          const [ x, y ] = this.relative.split(" ").map(Number);

          return {
            x,
            y
          };
        }
        catch (e) {
          return {
            x: 0,
            y: 0
          }
        }
      },
      pos() {
        return {
          x: Number(this.x),
          y: Number(this.y)
        };
      },
      offset() {
        const padding = this.padding.split(" ").map(Number);
        return [
          padding[0],
          padding[1] || padding[0],
          padding[2] || padding[0],
          padding[3] || padding[1] || padding[0]
        ];
      },
      computedStyle() {
        const testElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        testElement.style = this.css;
        return testElement.style;
      },
      styleObj() {
        const computedStyle = this.computedStyle;

        const obj = {};
        for (let key in computedStyle) {
          //console.log(key in computedStyle);
          if (computedStyle.hasOwnProperty(key)) {
            const value = computedStyle[key];
            if (key.match(/[^0-9]/) && value) {
              obj[key] = value;
            }
          }
        }
        for (let key of computedStyle) {
          obj[key] = computedStyle[key];
        }
        return obj;
      },
      fontSize() {
        return Number(this.computedStyle["font-size"].replace(/[^0-9]/g, ""));
      },
      lineBoundings() {
        const textArray = this.text.filter(line => line);

        return textArray.map((line, index) => {
          const { width, height } = textInfo(line, this.styleObj);
          return {
            width: this.offset[3] + width + this.offset[1],
            height: this.offset[0] + this.fontSize + this.offset[2],
            text: line
          }
        });
      },
      bounding() {
        const width = Math.max(...this.lineBoundings.map(box => box.width));
        const height = this.lineBoundings.map(box => box.height).reduce((accumulator, height) => accumulator + (height * this.__lineHeight), 0);

        const exampleLine = this.lineBoundings[0];

        var x = Number(this.x);
        var y = Number(this.y);

        x = x - width * this.relativePos.x;
        y = y - height * this.relativePos.y;

        return {
          x,
          y,
          width,
          height
        }
      },
      lines() {

        const { width, height, x, y } = this.bounding;

        return this.lineBoundings.map((box, index) => {
          const innerLineOffset = width - box.width;
          const xWithAlignMap = new Map([
            ["left", x],
            ["right", x + innerLineOffset],
            ["center", x + innerLineOffset / 2]
          ]);

          const pos = {
            x: xWithAlignMap.get(this.align) || xWithAlignMap.get("left"),
            y: y + (box.height * this.__lineHeight) * index
          }

          const center = ((...rel) => {
            return {
              x: pos.x + box.width * rel[0],
              y: pos.y + box.height * rel[1]
            }
          })(0.5, 0.5);

          return {
            i: index,
            text: box.text,
            x: pos.x,
            y: pos.y,
            center,
            width: box.width,
            height: box.height
          };
        });
      }
    },
    created() {
      //console.log(this.lines);
    },
  }
</script>
