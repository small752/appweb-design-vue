<template>
  <div class="doc-detail-cont">
    <Popup
      v-bind:value="visible"
      width="100%"
      height="100%"
      v-bind:hide-on-blur="false"
      v-bind:should-rerender-on-show="true"
      v-bind:should-scroll-top-on-show="true"
      position="right"
    >
      <div class="popup-content">
        <Loading :show="loading" text="加载中"/>
        <PopupHeader
          class="detail-popup-header"
          right-text="关闭"
          :title="docTitle"
          v-bind:show-bottom-border="true"
          @on-click-right="closeDetailPop"
        />
          <H5Pdf
            v-if="pdfVisible"
            v-bind:src="pdfSrc"
          />
      </div>

    </Popup>
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>

<style>
.detail-popup-header .vux-popup-header-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
