<template>
  <div class="doc-detail-cont">
    <PopupHeader
      left-text="关闭"
      right-text="操作"
      title="文档详情"
      v-bind:show-bottom-border="true"
      @on-click-left="closeDetailPop"
      @on-click-right="openDetailHandle"
    />
      <Actionsheet
        v-model="handleVisible"
        v-bind:show-cancel="false"
        v-bind:menus="handleMenus"
        @on-click-menu="handleOnMenuClick"
      />
      <H5Pdf
        v-if="detailData.docContent != undefined && detailData.pdfUrl != '' && pdfVisible"
        v-bind:src="pdfSrc"
      />

      <DocTodoDetailHistory
        v-if="detailHistoryVisible"
        v-bind:visible="detailHistoryVisible"
        v-bind:docid="docid"
        v-bind:docType="docType"
        v-on:handleOnClose="handleOnCloseHistory"
      />

      <DocTodoDetailInfo
        v-if="detailInfoVisible"
        v-bind:visible="detailInfoVisible"
        v-bind:docid="docid"
        v-bind:docType="docType"
        v-on:handleOnClose="handleOnCloseInfo"
      />

      <DocTodoDetailAttachment
        v-if="detailAttachmentVisible"
        v-bind:visible="detailAttachmentVisible"
        v-bind:docid="docid"
        v-bind:docType="docType"
        v-on:handleOnClose="handleOnCloseAttachment"
      />

      <DocTodoDetailTip
        v-if="detailTipVisible"
        v-bind:visible="detailTipVisible"
        v-bind:docid="docid"
        v-bind:docType="docType"
        v-on:handleOnClose="handleOnCloseTip"
      />

      <DocTodoDetailAuditguide
        v-if="detailAuditguideVisible"
        v-bind:visible="detailAuditguideVisible"
        v-bind:docid="docid"
        v-bind:docType="docType"
        v-bind:content="detailData.auditGuide"
        v-on:handleOnClose="handleOnCloseAuditguide"
      />

      <DocTodoDetailSelfEvaluate
        v-if="detailVisibleSelfEvaluate"
        v-bind:visible="detailVisibleSelfEvaluate"
        v-bind:docid="docid"
        v-bind:docType="docType"
        v-on:handleOnClose="handleOnCloseSelfEvaluate"
      />

      <DocTodoDetailEvaluate
        v-if="detailVisibleEvaluate"
        v-bind:visible="detailVisibleEvaluate"
        v-bind:docid="docid"
        v-bind:docType="docType"
        v-on:handleOnClose="handleOnCloseEvaluate"
      />

      <DocTodoDetailAfterEvaluate
        v-if="detailVisibleAfterEvaluate"
        v-bind:visible="detailVisibleAfterEvaluate"
        v-bind:docid="docid"
        v-bind:docType="docType"
        v-on:handleOnClose="handleOnCloseAfterEvaluate"
      />

      <DocTodoDetailSubmit
        v-if="detailVisibleSubmit"
        v-bind:visible="detailVisibleSubmit"
        v-bind:docid="docid"
        v-bind:docType="docType"
        v-bind:docfileid="detailData.docFileId"
        v-bind:docTitle="docTitle"
        v-on:handleOnClose="handleOnCloseSubmit"
        v-on:handleOnSubmitSuccess="handleOnCloseSubmitSuccess"
        :isWfStepEndExecuter="detailData.isWfStepEndExecuter == '1'"
      />
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>
