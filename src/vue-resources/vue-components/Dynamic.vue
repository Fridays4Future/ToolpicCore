<template>
  <g>
    <defs>
      <g ref="slotTest">
        <slot></slot>
      </g>
    </defs>
    <g ref="slotContainer">
      <slot></slot>
    </g>
  </g>
</template>

<style scoped>

</style>

<script>
  export default {
    name: "Dynamic",
    props: ['width', 'height', 'origin'],
    data() {
      return {
        //transformOriginAbsolute: '0px 0px',
        //scale: 1
      };
    },
    methods: {
      getOrigin() {
        const originRelative = this.origin.split(' ').map(Number);
        if (this.$refs.slotContainer) {
          const bounding = this.$refs.slotTest.getBBox();
          const axisNames = ['x', 'y'];
          const sideNames = ['width', 'height'];
          return originRelative.map((rel, axisIndex) => {
            const axisName = axisNames[axisIndex];
            const sideName = sideNames[axisIndex];
            return bounding[axisName] + rel * bounding[sideName];
          }).map(val => val + 'px').join(' ');
        }

        return '0px 0px';
      },
      getScale() {
        if (this.$refs.slotContainer) {
          const bounding = this.$refs.slotTest.getBBox();

          // Required scales to reach max width / height
          const scales = {
            x: Number(this.width) / bounding.width,
            y: Number(this.height) / bounding.height
          };

          const scale = Math.min(scales.x, scales.y);
          if (scale > 0) {
            return scale;
          }
        }
        return 1;
      }
    },
    computed: {

    },
    mounted() {
      setTimeout(() => {
        this.transformOriginAbsolute = this.getOrigin();
      });
    },
    updated() {
      this.$refs.slotContainer.style.transformOrigin = this.getOrigin();
      this.$refs.slotContainer.style.transform = 'scale(' + this.getScale() + ')';
    }
  }
</script>
