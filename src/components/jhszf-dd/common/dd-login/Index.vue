<template>
  <div class="dd-login-cont">
      <Loading :show="loading" />

      <Sticky
        v-show="choseUser"
        :offset="0"
        :check-sticky-support="false">
        <PopupHeader
          title="请选择要登陆的账号"
          right-text="确定"
          @on-click-right="handleOnSelectUserLogin"
        ></PopupHeader>
      </Sticky>
      <Group v-show="choseUser">
        <Radio
          :options="userList"
          @on-change="changeUserSelect">
        </radio>
      </Group>
  </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>
