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
      <div class="popup-content">
        <Loading :show="loading" text="加载中"/>
        <PopupHeader
          left-text="关闭"
          right-text="确定"
          title="审核质量跟踪评价表"
          v-bind:show-bottom-border="true"
          @on-click-left="closePop"
          @on-click-right="handleOnSubmit"
        />

        <Group label-align="right" label-width="4.5em" label-margin-right="2em">

          <XInput
            title="评价主体"
            class="self-evaluate-type-name"
            novalidate
            readonly
            v-model="selfEvaluateObject.selfEvaluationTypeName"
            placeholder-align="right"></XInput>

          <div
            v-show="selfEvaluateObject.selfEvaluationRecordValueDTOs && selfEvaluateObject.selfEvaluationRecordValueDTOs.length > 0"
            class="self-evaluate-list-cont">

            <PopupRadio
              v-for="(item, index) in selfEvaluateObject.selfEvaluationRecordValueDTOs" :key="index"
              class="self-evaluate-list-popup-radio"
              :title="item.selfEvaluationItemsName"
              :options="getSelfEvaluateListOpts(item)"
              v-model="item.value"></PopupRadio>
          </div>

          <div class="self-evaluate-main info-row">
            <div class="info-row-left">质量评价</div>
            <Checker
              v-model="selfEvaluateObject.qualityGrade"
              :radio-required="true"
              class="info-row-right"
              default-item-class="self-evaluate-main-checkitem"
              selected-item-class="self-evaluate-main-checkitem-selected"
            >
              <CheckerItem :value="1">优</CheckerItem>
              <CheckerItem :value="2">良</CheckerItem>
              <CheckerItem :value="3">一般</CheckerItem>
              <CheckerItem :value="4">差</CheckerItem>
            </Checker>
          </div>

          <XTextarea
            v-if="selfEvaluateObject.isSelfEvaluation == '1'"
            class="self-evaluate-memo"
            title="点评意见"
            placeholder="请填写点评意见"
            :show-counter="true"
            :rows="4"
            :max="200"
            v-model="selfEvaluateObject.comments"></XTextarea>

          <XTextarea
            class="self-evaluate-memo"
            title="签名"
            placeholder="请填写签名"
            :show-counter="true"
            :rows="4"
            :max="200"
            v-model="selfEvaluateObject.memo"></XTextarea>

        </Group>

      </div>
    </Popup>
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>

<style>
.self-evaluate-list-popup-radio .vux-cell-bd .vux-label {
  text-align: left !important;
  width: 100% !important;
}
</style>
