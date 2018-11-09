<template>

  <div>
    <XDialog
      v-bind:show="visible"
      width="100%"
      height="100%"
      :hide-on-blur="true"
      :scroll="true"
    >
      <div class="doc-auditguide-cont">
        <Loading :show="loading" text="加载中"/>
        <PopupHeader
          right-text="关闭"
          title="考核标准"
          v-bind:show-bottom-border="true"
          @on-click-right="closePop"
        />
        <div class="auditguide-content" v-html="htmlContent"></div>
      </div>
    </XDialog>

  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>
