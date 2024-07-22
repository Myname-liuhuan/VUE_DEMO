<template>
  <div class="image-tile" @click="onClick">
    <img :src="imageUrl" alt="Image" />
  </div>
</template>

<script>
  export default {
    name: 'ImageTile',
    props: {
      imageUrl: {
        type: String,
        required: true,
      },
      onClick: {
        type: Function,
        required: true,
      },
    },
  }
</script>

<style>
  .image-tile {
    width: 100%;
    margin-bottom: 16px;
    cursor: pointer;
  }
  .image-tile img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
