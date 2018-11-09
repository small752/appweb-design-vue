<template>
  <div class="page-h5-cont">
    <Loading :show="loading" text="加载中"/>

    <div class="page-h5-content">
      <div>
        <i class="icon icon-lm-baoming baoming-btn" size="30" @click="changeEnrollModal"></i>
      </div>

    </div>

    <XDialog
      v-model="formProps.visible"
      class="enroll-form-modal"
    >
      <div class="modal-cont">

        <div class="modal-header-cont">
          <i class="icon icon-lm-close modal-close-btn" size="30" @click="changeEnrollModal"></i>
          <div class="modal-header-title"><div class="modal-header-title-content">报名表单</div></div>
        </div>

        <div class="modal-content">
          <Group label-width="120" label-align="left">
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵昵称称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵昵称称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵昵称称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
            <XInput title="昵称" placeholder="请问怎么称呼"></XInput>
          </Group>
        </div>
        
      </div>
    </XDialog>
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>
