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
          title="签批历史"
          v-bind:show-bottom-border="true"
          @on-click-right="closePop"
        />
        <Timeline class="doc-history-timeline"  v-show="dataSource.length > 0">
          <TimelineItem v-for="(item, index) in dataSource" :key="index">
            <div class="doc-history-cont">
              <div class="item-title">签批人: {{item.createname}}</div>
              <div class="item-desc info-row">
                <div class="info-row-left">签批时间: {{item.createtime || ''}}</div>
                <div class="info-row-right">
                  <XButton
                    type="primary"
                    v-bind:mini="true"
                    action-type="button"
                    class="show-history-btn"
                    @click.native="openHistoryDetailPop(item)"
                  >查看</XButton>
                </div>
              </div>
            </div>
          </TimelineItem>
        </Timeline>

        <ListEmptyIcon v-show="dataSource.length == 0"></ListEmptyIcon>
      </div>
    </Popup>

    <Popup
      v-bind:value="detailVisible"
      width="100%"
      height="100%"
      v-bind:hide-on-blur="false"
      v-bind:should-rerender-on-show="true"
      v-bind:should-scroll-top-on-show="true"
      position="right"
    >
      <div class="doc-detail-history-cont">
        <PopupHeader
          right-text="关闭"
          title="签批历史详情"
          v-bind:show-bottom-border="true"
          @on-click-right="closeHistoryDetailPop"
        />
          <H5Pdf
            v-if="detailData.fileurl != undefined && detailData.fileurl != ''"
            v-bind:src="pdfSrc"
          />
      </div>
    </Popup>
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>

<style>
.doc-history-timeline ul {
  margin: 0;
  padding: 0;
}
</style>
