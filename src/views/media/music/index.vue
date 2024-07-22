<template>
  <div class="mediamain">
    <Waterfall />
    <Player />
  </div>
</template>

<script>
  import Waterfall from '@/components/media/Waterfall.vue'
  import Player from '@/components/media/Player.vue'

  export default {
    name: 'App',
    components: {
      Waterfall,
      Player,
    },
  }
</script>

<style>
  .mediamain {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    position: relative;
  }
</style>
