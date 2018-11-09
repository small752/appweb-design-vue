<template>
  <div class="doc-list-cont">
    <view-box
      v-infinite-scroll="queryMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="50"
    >
      <Loading :show="loading" text="加载中"/>
      <div class="doc-list-content">
        <ul v-if="docType != '5' && dataSource.length > 0" class="list-container">

          <li v-for="(item, key, index) in dataSource" :key="index" class="doc-list-item-li" >
            <div class="doc-list-item-cont">

              <div class="star-icon-cont">
                <svg class="icon list-attention-icon" aria-hidden="true" v-on:click.prevent="attentionChange(item)">
                  <use v-show="item.signstatus == '0'" xlink:href="#icon-zl-star-o"></use>
                  <use v-show="item.signstatus == '1'" xlink:href="#icon-zl-star"></use>
                </svg>
              </div>

              <div class="info-cont" style="width: calc(100% - 4rem)">
                <div class="info-content" v-on:click.prevent="linkToDetail(item)">
                  <div class="info-title">
                    {{item.title || '无标题'}}
                  </div>

                  <div class="info-row">
                    <div class="info-row-left">发送人: {{item.createusername || ''}}</div>
                    <div class="info-row-right">{{item.createdatetime || ''}}</div>
                  </div>
                </div>
              </div>

            </div>
          </li>
          <LoadMore :show-loading="hasMore" v-bind:tip="hasMore ? '加载更多' : '没有更多了'"></LoadMore>
        </ul>

        <ul v-else-if="docType == '5' && dataSource.length > 0" class="list-container">

          <li v-for="(item, key, index) in dataSource" :key="index" class="doc-list-item-li" >
            <div class="doc-list-item-cont">

              <div class="star-icon-cont">
                <svg class="icon list-attention-icon" aria-hidden="true">
                  <use v-show="item.readstatus == '0'" style="color: #f43530;" xlink:href="#icon-zl-noread"></use>
                  <use v-show="item.readstatus == '1'" style="color: #999999;" xlink:href="#icon-zl-has-read"></use>
                </svg>

                <svg v-if="item.warnlevel" class="icon list-attention-icon" aria-hidden="true">
                  <use v-show="item.warnlevel == 'red'" style="color: #f43530;" xlink:href="#icon-zl-warn-bulb"></use>
                  <use v-show="item.warnlevel == 'yellow'" style="color: #ffbe00;" xlink:href="#icon-zl-warn-bulb"></use>
                </svg>
              </div>

              <div class="info-cont" style="width: calc(100% - 5rem)">
                <div class="info-content" v-on:click.prevent="linkToDetail(item)">
                  <div class="info-title">
                    {{item.title || '无标题'}}
                  </div>

                  <div class="info-row">
                    <div class="info-row-left">{{item.createdatetime && item.createdatetime.substring(2) || ''}}</div>
                  </div>
                </div>
              </div>

            </div>
          </li>
          <LoadMore :show-loading="hasMore" v-bind:tip="hasMore ? '加载更多' : '没有更多了'"></LoadMore>
        </ul>

        <ListEmptyIcon v-else></ListEmptyIcon>

      </div>

    </view-box>

    <Popup
      v-bind:value="detailProps.visible"
      width="100%"
      height="100%"
      v-bind:hide-on-blur="false"
      v-bind:should-rerender-on-show="true"
      v-bind:should-scroll-top-on-show="true"
      position="right"
    >
      <DocTodoDetail
        v-if="detailProps.visible"
        v-bind:docid="detailProps.docid"
        v-on:closeDetailPop="closeDetailPop"
        v-on:refreshList="queryList"
        v-bind:docType="docType"
        v-bind:docTitle="detailProps.docTitle"
      />
    </Popup>
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>
