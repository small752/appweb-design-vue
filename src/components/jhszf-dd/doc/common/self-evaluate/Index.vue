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
          title="自评结果"
          v-bind:show-bottom-border="true"
          @on-click-right="closePop"
        />

        <div
          v-for="(item, index) in dataSource" :key="index"
          class="step-self-evaluate-cont"
        >
          <FormPreview
            class="form-evaluate-list"
            :header-label="item.selfEvaluationTypeName"
            :header-value="'签名: ' + item.memo"
            :body-items="formEvaluateList(item.selfEvaluationRecordValueDTOs)"
          />

          <div class="info-row">
            <div class="info-row-left">质量评价</div>
            <Checker
              :value="item.qualityGrade+''"
              :radio-required="true"
              class="info-row-right"
              default-item-class="demo2-item"
              selected-item-class="demo2-item-selected"
            >
              <CheckerItem  value="1">优</CheckerItem>
              <CheckerItem  value="2">良</CheckerItem>
              <CheckerItem  value="3">一般</CheckerItem>
              <CheckerItem  value="4">差</CheckerItem>
            </Checker>
          </div>
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
