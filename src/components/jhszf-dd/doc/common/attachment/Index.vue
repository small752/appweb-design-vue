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
          title="附件"
          v-bind:show-bottom-border="true"
          @on-click-right="closePop"
        />
        <Group class="doc-attachment-group"  v-show="dataSource.length > 0">
          <CellBox
            class="item-title"
            v-for="(item, index) in dataSource"
            :key="index"
            is-link
            @click.native="clickToDownload(item)"
          >
            {{item.createname}}
          </CellBox>
        </Group>

        <ListEmptyIcon v-show="dataSource.length == 0"></ListEmptyIcon>
      </div>
    </Popup>
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>
