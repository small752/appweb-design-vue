<template>
  <div class="page-list-cont">
      <Loading :show="loading" text="加载中"/>
      <ViewBox
        v-infinite-scroll="queryMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="50"
        class="page-list-content">

        <Sticky
          :offset="0"
          :check-sticky-support="false">
          <PopupHeader
            class="detail-popup-header"
            right-text="关闭"
            :title="typeTitle"
            v-bind:show-bottom-border="true"
            @on-click-right="backToXxkwIndex"
          />
        </Sticky>

        <Group label-align="right" label-width="4.5em" label-margin-right="2em">
          <CellBox
            v-for="(item, index) in dataSource" :key="index"
            :title="item.title"
            is-link
            class="page-lsit-item"
            value-align="left"
            @click.native="handleOnClickTypeItem(item)">
            <div class="list-item-cont">
              <div class="star-icon-cont">
                <svg class="icon list-attention-icon" aria-hidden="true">
                  <use v-show="item.isdel == '1'" style="color: #f43530;" xlink:href="#icon-zl-noread"></use>
                  <use v-show="item.isdel == '0'" style="color: #999999;" xlink:href="#icon-zl-has-read"></use>
                </svg>
              </div>

              <div class="info-cont" style="width: calc(100% - 5rem)">
                <div class="info-content">
                  <div class="info-title">
                    {{item.title || '无标题'}}
                  </div>

                  <div class="info-row">
                    <div class="info-row-left">{{item.modifydatetime || ''}}</div>
                  </div>
                </div>
              </div>
            </div>
          </CellBox>
        </Group>
        <LoadMore :show-loading="hasMore" v-bind:tip="hasMore ? '加载更多' : '没有更多了'"></LoadMore>

      </ViewBox>

      <XxkwDetail
        v-if="detailProps.visible"
        :visible="detailProps.visible"
        :sysPendingsId="detailProps.docid"
        :docTitle="detailProps.docTitle"
        v-on:closeDetailPop="closeDetailPop"
      />
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>

<style>
.page-lsit-item .vux-cell-bd .vux-label {
  width: 100% !important;
  text-align: left !important;
  margin-right: 0 !important;
}

.page-lsit-item .weui-cell__ft {
  padding-left: 1rem;
}
</style>
