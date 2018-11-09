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
          title="小贴士"
          v-bind:show-bottom-border="true"
          @on-click-right="closePop"
        />

        <div class="tip-cont-header">
          <Tab
            v-model="tipType"
            v-bind:height="30"
          >
            <TabItem>我的小贴士</TabItem>
            <TabItem>我发送的小贴士</TabItem>
          </Tab>
        </div>

        <Group class="to-me-tip-group"  v-show="tipType == 0">
          <CellBox
            class="item-title"
            v-for="(item, index) in toMeTipList"
            :key="index"
            is-link
            @click.native="showTipDetail(item)"
          >
            <div class="list-item-cont">

              <div class="star-icon-cont">
                <svg
                  class="icon list-attention-icon"
                  aria-hidden="true"
                  v-bind:class="{'item-icon-noread': item.isread == '0'}" >
                  <use v-if="item.isread == '0'" xlink:href="#icon-zl-noread"></use>
                  <use v-else xlink:href="#icon-zl-has-read"></use>
                </svg>
              </div>

              <div class="info-cont" style="width: calc(100% - 4rem)">
                <div class="info-content">
                  <div class="info-row">
                    <div class="info-row-left">发送人:</div>
                    <div class="info-row-right">{{item.createname || ''}}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-row-left">发送时间:</div>
                    <div class="info-row-right">{{item.createtime || '无'}}</div>
                  </div>
                </div>
              </div>

            </div>
          </CellBox>
        </Group>

        <Group class="my-tip-group"  v-show="tipType == 1">
          <CellBox
            class="item-title"
            v-for="(item, index) in meSendTipList"
            :key="index"
            is-link
            @click.native="showTipDetail(item)"
          >
            <div class="list-item-cont">

              <div class="star-icon-cont">
                <svg
                  class="icon list-attention-icon"
                  aria-hidden="true"
                  v-bind:class="{'item-icon-noread': item.isread == '0'}">
                  <use v-if="item.isread == '0'" xlink:href="#icon-zl-noread"></use>
                  <use v-else xlink:href="#icon-zl-has-read"></use>
                </svg>
              </div>

              <div class="info-cont" style="width: calc(100% - 4rem)">
                <div class="info-content">
                  <div class="info-row">
                    <div class="info-row-left">接收人:</div>
                    <div class="info-row-right">{{item.createname || ''}}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-row-left">接收时间:</div>
                    <div class="info-row-right">{{item.createtime || '无'}}</div>
                  </div>
                </div>
              </div>

            </div>
          </CellBox>
        </Group>
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
      <div class="tip-detail-cont">
        <PopupHeader
          right-text="关闭"
          title="小贴士详情"
          v-bind:show-bottom-border="true"
          @on-click-right="closeTipDetailPop"
        />
        <div v-if="detailData.contenttype == '1'" class="tip-detail-content">{{detailData.fileurl}}</div>
        <H5Pdf
            v-else
            v-bind:src="detailData.pdfSrc"
          />
      </div>
    </Popup>
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>
