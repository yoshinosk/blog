<template>
  <div></div>
</template>

<script>
export default {
  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id);
  },
};
</script>

<style lang="scss" scoped>
</style>
