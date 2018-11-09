<template>

  <div>
    <Popup
      v-bind:value="visible"
      width="100%"
      height="100%"
      v-bind:hide-on-blur="false"
      v-bind:should-rerender-on-show="true"
      v-bind:should-scroll-top-on-show="true"
      position="top"
    >
      <div class="doc-detail-history-cont">
        <Loading :show="loading" text="加载中"/>
        <PopupHeader
          right-text="关闭"
          title="考评结果"
          v-bind:show-bottom-border="true"
          @on-click-right="closePop"
        />

        <div
          v-for="(item, index) in dataSource" :key="index"
          class="step-self-evaluate-cont"
        >
          <FormPreview
            class="form-evaluate-list"
            :header-label="item.largerName"
            :header-value="'扣分: ' + (item.totalScore - item.scored)"
            :body-items="formEvaluateList(item.evaluationRecordDTOs)"
          />
        </div>

      </div>
    </Popup>
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>

<style>
.form-evaluate-list .weui-form-preview__hd .weui-form-preview__value {
  font-size: 1.2rem;
}

.form-evaluate-list .weui-form-preview__label {
  text-align-last: left;
  max-width: 80%;
}
</style>
