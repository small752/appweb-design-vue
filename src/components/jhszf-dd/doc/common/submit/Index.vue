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
          left-text="关闭"
          right-text="确定"
          title="提交"
          v-bind:show-bottom-border="true"
          @on-click-left="closePop"
          @on-click-right="handleOnSubmit"
        />

        <Group label-align="right" label-width="4.5em" label-margin-right="2em">

          <div v-if="bizdata.curStepStepsSelectMode === 'ALL'">

            <div v-if="isWfStepEndExecuter" v-for="(item, index) in bizdata.nextStepLt" :key="index"
              class="next-step-form">
              <Selector
                placeholder="请选择下一步骤"
                title="下一步骤"
                name="nextsteptype"
                direction="rtl"
                v-model="item.id"
                :options="getOneStepOpts(item)" ></Selector>

                <Cell
                  title="处理人"
                  primary="content"
                  :value="item.nextpersonstr"
                  is-link
                  @click.native="handleOnOpenNextperson(item)"></Cell>

                <Selector
                  placeholder="请选择人员关系"
                  title="人员关系"
                  name="persontype"
                  direction="rtl"
                  v-model="item.type"
                  :options="getOneStepTypeOpts(item)" ></Selector>
            </div>

          </div>

          <div v-else>
            <div
              v-if="isWfStepEndExecuter"
              class="next-step-form">
              <Selector
                placeholder="请选择下一步骤"
                title="下一步骤"
                name="nextsteptype"
                direction="rtl"
                v-model="bizdata.nextStepId"
                :options="getAllStepOpts()"
                @on-change="handleOnNextstepmodeChange"></Selector>

                <Cell
                  title="处理人"
                  primary="content"
                  :value="nextSteppersonPop.step.nextpersonstr"
                  is-link
                  @click.native="handleOnOpenNextperson(nextSteppersonPop.step)"></Cell>

                <Selector
                  placeholder="请选择人员关系"
                  title="人员关系"
                  name="persontype"
                  direction="rtl"
                  v-model="nextSteppersonPop.step.type"
                  :options="getOneStepTypeOpts()"></Selector>
            </div>
          </div>

          <XTextarea
            title="处理意见"
            placeholder="请填写处理意见"
            :show-counter="true"
            :rows="4"
            :max="200"
            v-model="bizdata.messagestr"></XTextarea>

          <XTextarea
            v-if="isWfStepEndExecuter"
            title="小贴士"
            placeholder="请填写小贴士"
            :show-counter="true"
            :rows="4"
            :max="200"
            v-model="bizdata.tipstr"></XTextarea>

          <XSwitch v-if="isWfStepEndExecuter" title="短信提醒" v-model="bizdata.isMsg"></XSwitch>

          <XTextarea
            v-if="isWfStepEndExecuter && bizdata.isMsg"
            title="短信内容"
            placeholder="请填写短信内容"
            :show-counter="true"
            :rows="4"
            :max="200"
            v-model="bizdata.msgContent"></XTextarea>
        </Group>

      </div>
    </Popup>

    <Popup
      v-bind:value="nextSteppersonPop.visible"
      width="100%"
      height="100%"
      v-bind:hide-on-blur="false"
      v-bind:should-rerender-on-show="true"
      v-bind:should-scroll-top-on-show="true"
      position="right"
    >
      <div class="tip-detail-cont">
        <PopupHeader
          left-text="关闭"
          right-text="确定"
          title="处理人"
          v-bind:show-bottom-border="true"
          @on-click-left="closeNextsteppersonPop"
          @on-click-right="handleOnChangeNextperson"
        />
        <Checklist
          class="next-step-person-checklist"
          title="处理人"
          required
          :options="nextSteppersonPop.options"
          v-model="nextSteppersonPop.nextpersonarr"></checklist>
      </div>
    </Popup>

    <DocTodoDetailSubmitEvaluate
      v-if="evaluateProps.visible"
      :visible="evaluateProps.visible"
      :docType="docType"
      :docid="docid"
      :evaluationResult="evaluateProps.evaluationResult"
      v-on:handleOnClose="handleOnSubmitEvaluateClose"
      v-on:handleOnCancle="handleOnSubmitEvaluateCancle"
    />

    <DocTodoDetailSubmitSelfEvaluate
      v-if="selfEvaluateProps.visible"
      :visible="selfEvaluateProps.visible"
      :docType="docType"
      :docid="docid"
      :selfEvaluationResult="selfEvaluateProps.selfEvaluationResult"
      v-on:handleOnClose="handleOnSubmitSelfEvaluateClose"
      v-on:handleOnCancle="handleOnSubmitSelfEvaluateCancle"
    />
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>

<style>
.next-step-person-checklist .weui-cell__bd {
  text-align: left;
}

.next-step-form .weui-cell__ft {
  max-height: 5rem;
  overflow-y: auto;
}
</style>
