<template>
  <div class="page">
    登录主页
  </div>
</template>

<script setup lang="ts">
import { $http } from '../../asset/http'
onMounted(async () => {
  // await getProfile()
})
</script>

<style lang="less" scoped>
.page {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #f2f3f5;
  color: rgb(93, 92, 92);
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    height: 60px;
    background-color: #fff;
    border-bottom: 1px #e4e5e8 solid;
    display: flex;
    flex-direction: row;
    .logo {
      flex: 1;
      margin: 0px;
      font-size: 18px;
      font-weight: 600;
      line-height: 60px;
      img {
        height: 40px;
        vertical-align: middle;
        padding: 0px 20px;
      }
    }
    .fn-btn {
      line-height: 60px;
      width: 50px;
      text-align: center;
    }
    .fn-list {
      padding-right: 20px;
    }
  }
  .content {
    padding: 10px;
    display: flex;
    flex: 1;
    flex-direction: row;
    height: 100%;
    .box {
      background-color: #fff;
      border: 1px #e4e5e8 solid;
      margin: 5px;
      padding: 10px;
    }
    .left-panel {
      flex:1;
      display: flex;
      flex-direction: column;
      .app-list {
        height: 280px;
        display: flex;
        flex-direction: column;
        .user-info {
          height: 60px;
          font-size: 18px;
          line-height: 60px;
          padding-left: 20px;
        }
        .entry-list {
          display: flex;
          padding: 5px 20px;
          height: 100%;
          flex-direction: row;
          flex-wrap: wrap;
          .item {
            width: 120px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            margin: 5px;
            border: 1px #e4e5e8 solid;
            color: #fff;
            font-weight: 500;
            font-size: 14px;
            background-image: linear-gradient(-45deg, #4798f5, #a7c7f1);
            &:hover {
              background-image: linear-gradient(-45deg, #64a5ef, #c4d7f1);
              cursor: pointer;
            }
          }
        }
      }
      .work-list {
        flex: 1;
      }
    }
    .right-panel {
      width: 300px;
    }
  }
}
</style>
