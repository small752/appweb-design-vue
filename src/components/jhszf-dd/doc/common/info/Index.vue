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
          title="意见信息"
          v-bind:show-bottom-border="true"
          @on-click-right="closePop"
        />
        <Timeline class="doc-info-timeline"  v-show="dataSource.length > 0">
          <TimelineItem v-for="(item, index) in dataSource" :key="index">
            <div class="doc-history-cont">
              <div class="item-title">步骤: {{item.stepname}}</div>
              <div class="item-desc info-row">
                <div class="info-row-left">办理人员: {{item.username || ''}}</div>
              </div>
              <div class="item-desc info-row">
                <div class="info-row-left">办理意见: {{item.option || ''}}</div>
              </div>
              <div class="item-desc info-row">
                <div class="info-row-left">首次打开时间: {{item.receivedate || ''}}</div>
              </div>
              <div class="item-desc info-row">
                <div class="info-row-left">完成时间: {{item.operatdate || ''}}</div>
              </div>
            </div>
          </TimelineItem>
        </Timeline>

        <ListEmptyIcon v-show="dataSource.length == 0"></ListEmptyIcon>
      </div>
    </Popup>
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>

<style>
.doc-info-timeline ul {
  margin: 0;
  padding: 0;
}
</style>
