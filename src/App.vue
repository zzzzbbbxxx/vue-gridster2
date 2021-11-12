<template>
  <gridster :options="options">
    <gridster-item v-for="(item, index) in dashboard" :item="item" :key="index">
      <template #default="$item">
        {{$item}}
      </template>
    </gridster-item>
  </gridster>
</template>

<script>


import Gridster from "@/components/Gridster/Gridster";
import GridsterItem from "@/components/Gridster/GridsterItem.vue";
import {CompactType, DisplayGrid, GridType} from "@/components/Gridster/GridsterConfig";
export default {
  name: 'App',
  components: {
    GridsterItem,
    Gridster
  },
  setup() {
    return {
      dashboard: [

        {cols: 2 * 3, rows: 2 * 3, y: 0, x: 0, hasContent: true},
        {cols: 2 * 3, rows: 2 * 3, y: 0, x: 4},
        {cols: 1 * 3, rows: 1 * 3, y: 2, x: 5},
        {cols: 1 * 3, rows: 1 * 3, y: 1, x: 0},
        {cols: 1 * 3, rows: 1 * 3, y: 1, x: 0},
        {cols: 2 * 3, rows: 2 * 3, y: 3, x: 5, minItemRows: 2, minItemCols: 2, label: 'Min rows & cols = 2'},
        {cols: 2 * 3, rows: 2 * 3, y: 2, x: 0, maxItemRows: 2, maxItemCols: 2, label: 'Max rows & cols = 2'},
        {cols: 2 * 3, rows: 1 * 3, y: 2, x: 2, dragEnabled: true, resizeEnabled: true, label: 'Drag&Resize Enabled'},
        {cols: 1 * 3, rows: 1 * 3, y: 2, x: 4, dragEnabled: false, resizeEnabled: false, label: 'Drag&Resize Disabled'},
        {cols: 1 * 3, rows: 1 * 3, y: 2, x: 6},
        {cols: 1 * 3, rows: 1 * 3, y: 4, x: 0, id: 'test'}
      ],
      options: {
        gridType: GridType.Fixed,
        compactType: CompactType.None,
        margin: 15,
        outerMargin: true,
        outerMarginTop: null,
        outerMarginRight: null,
        outerMarginBottom: null,
        outerMarginLeft: null,
        useTransformPositioning: true,
        mobileBreakpoint: 640,
        minCols: 1,
        maxCols: 100,
        minRows: 1,
        maxRows: 100,
        maxItemCols: 100,
        minItemCols: 1,
        maxItemRows: 100,
        minItemRows: 1,
        maxItemArea: 2500,
        minItemArea: 1,
        defaultItemCols: 1,
        defaultItemRows: 1,
        fixedColWidth: 121,
        fixedRowHeight: 52,
        keepFixedHeightInMobile: false,
        keepFixedWidthInMobile: false,
        scrollSensitivity: 10,
        scrollSpeed: 20,
        enableEmptyCellClick: false,
        enableEmptyCellContextMenu: false,
        enableEmptyCellDrop: false,
        enableEmptyCellDrag: false,
        enableOccupiedCellDrop: false,
        emptyCellDragMaxCols: 50,
        emptyCellDragMaxRows: 50,
        ignoreMarginInRow: false,
        draggable: {
          enabled: true,
        },
        resizable: {
          enabled: true,
        },
        swap: false,
        pushItems: true,
        disablePushOnDrag: false,
        disablePushOnResize: false,
        pushDirections: {north: true, east: true, south: true, west: true},
        pushResizeItems: false,
        displayGrid: DisplayGrid.Always,
        disableWindowResize: false,
        disableWarnings: false,
        scrollToNewItems: false
      }
    }
  }
}
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
* {
  box-sizing: inherit;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
</style>
