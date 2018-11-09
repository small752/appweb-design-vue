<template>
  <div class="page-list-cont">
      <Loading :show="loading" text="加载中"/>
      <div class="page-list-content">

        <Group label-align="right" label-width="4.5em" label-margin-right="2em">
          <Cell
            v-for="(item, index) in indexDataList" :key="index"
            :title="item.title"
            is-link
            class="page-lsit-item"
            value-align="left"
            @click.native="handleOnClickTypeItem(item)"><Badge v-show="item.count > 0" :text="item.count"></Badge></Cell>
        </Group>

      </div>
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
