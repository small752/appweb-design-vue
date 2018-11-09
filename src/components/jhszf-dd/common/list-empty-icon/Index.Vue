<template>
    <div class="list-empty-cont">
        <svg class="icon list-empty-icon" aria-hidden="true">
            <use xlink:href="#icon-zl-search-empty"></use>
        </svg>
        <div class="empty-text">{{text}}</div>
    </div>
</template>

<script>
export default {
  name: 'listEmptyIcon',
  data () {
    return {
      text: '列表空荡荡的'
    }
  }
}
</script>

<style lang="less" scoped >
    .list-empty-cont {
        margin-top: 3rem;
    }

    .list-empty-icon {
        font-size: 6rem;
    }

    .empty-text {
        color: #999;
        font-size: 0.9rem;
    }
</style>
