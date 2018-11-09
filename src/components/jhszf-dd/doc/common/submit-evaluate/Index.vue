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
          title="审核量化考评"
          v-bind:show-bottom-border="true"
          @on-click-left="closePop"
          @on-click-right="handleOnSubmit"
        />

        <Group label-align="right" label-width="4.5em" label-margin-right="2em">

          <CellBox
            v-for="(item, index) in dataSource" :key="index" >
            <div class="evaluation-item-cont">

              <div class="info-row">
                <div class="info-row-left">{{(index + 1)}}. {{item.evaluationItemsName || ''}}{{'(分值' + item.score + '分)'}}</div>
                <div class="info-row-right">
                  <CheckIcon :value.sync="item.isCut">扣分</CheckIcon>
                </div>
              </div>
              <ScoreNumber
                v-if="item.isCut"
                v-model="item.deductScore"
                style="float: right;"
                :defaultValue="item.score"
                :max="item.score" />

            </div>
          </CellBox>
        </Group>

      </div>
    </Popup>
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>
