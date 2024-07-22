<template>
  <div class="waterfall">
    <ImageTile v-for="(image, index) in images" :key="index" :image-url="image" :on-click="() => handleClick(index)" />
  </div>
</template>

<script>
  import ImageTile from './ImageTile.vue'

  export default {
    name: 'Waterfall',
    components: {
      ImageTile,
    },
    data() {
      return {
        images: [],
      }
    },
    mounted() {
      fetch('/api/media/music/pageList')
        .then((response) => response.json())
        .then((data) => {
          this.images = data
        })
    },
    methods: {
      handleClick(index) {
        console.log(`Clicked on image ${index}`)
      },
    },
  }
</script>

<style>
  .waterfall {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
</style>
