<template>
 <p>出错了...</p>
 <p>地址:{{invalidService}}不合法！</p>
</template>

<script setup lang="ts">
// 获取url中的参数
const { searchParams } = new URL(window.location.href);
const invalidService = searchParams.get('service');

</script>

<style lang="less" scoped>

</style>
