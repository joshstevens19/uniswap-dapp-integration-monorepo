<template>
  <div>
    <img
      v-if="!context.isSvg"
      v-bind:src="context.image"
      v-bind:class="classes"
    />
    <div
      v-if="context.isSvg"
      v-bind:class="classes"
      v-html="context.image"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'TokenIcon',
  props: ['classes', 'context'],
};
</script>
