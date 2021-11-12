<template>
  <div class="gridster-preview" :style="{display: display}" />
</template>

<script >
export default {
  name: 'GridsterPreview',
  props: {
    gridRenderer: {
      type: Object,
      default: () => {
        return {
          updateItem(htmlElement, gridsterItem) {}
        }
      },
    }
  },
  data() {
    return {
      el: this.$el,
      display: '',
    }
  },
  mounted() {

  },
  methods: {
    previewStyle(gridsterItem) {
      if (gridsterItem) {
        this.display = 'block'
        this.gridRenderer?.updateItem(this.$el, gridsterItem)
      } else {
        this.display = ''
        // this.renderer.setStyle(this.el, 'display', '')
      }
    }
  }
}

</script>

<style scoped>
.gridster-preview {
  position: absolute;
  display: none;
  background: rgba(192,197,202,0.60);
}

</style>
