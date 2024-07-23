<template>
  <div>
    <div ref="masonryContainer" class="masonry-container">
      <div v-for="(image, index) in images" :key="image.id" class="masonry-item" @click="handleClick(index)">
        <img :src="image.imageUrl" @load="handleImageLoad" />
      </div>
    </div>
    <MusicPlay
      :is-playing="isPlaying"
      :on-play-pause="togglePlayPause"
      :on-next="playNext"
      :on-previous="playPrevious"
      :song-title="songTitle"
      :song-duration="songDuration"
      :current-progress="currentProgress"
      :thumbnail-url="thumbnailUrl"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
  import Masonry from 'masonry-layout'
  import MusicPlay from './MusicPlay.vue'
  import axios from 'axios'

  export default defineComponent({
    name: 'Waterfall',
    components: {
      MusicPlay,
    },
    setup() {
      const images = ref([])
      const isPlaying = ref(false)
      const songTitle = ref('龙卷风-dzq')
      const songDuration = ref('5:00')
      const currentProgress = ref('3:00')
      const thumbnailUrl = ref('https://www.runoob.com/wp-content/themes/runoob/assets/images/qrcode.png')
      const masonryContainer = ref<HTMLElement | null>(null)
      let resizeObserver: ResizeObserver | null = null

      const togglePlayPause = () => {
        isPlaying.value = !isPlaying.value
      }

      const playNext = () => {
        console.log('Next song')
      }

      const playPrevious = () => {
        console.log('Previous song')
      }

      const handleClick = (index: number) => {
        console.log(`Clicked image ${index}`)
      }

      const handleImageLoad = () => {
        nextTick(() => {
          initializeMasonry()
        })
      }

      const fetchImages = async () => {
        try {
          const response = await axios.get('/api/media/music/pageList')
          if (response.status === 200) {
            images.value = response.data.data.records
          } else {
            console.error('Failed to fetch images')
          }
        } catch (error) {
          console.error('Error fetching images:', error)
        }
      }

      const initializeMasonry = () => {
        if (masonryContainer.value) {
          new Masonry(masonryContainer.value, {
            itemSelector: '.masonry-item',
            columnWidth: '.masonry-item',
            percentPosition: true,
          })
        }
      }

      onMounted(() => {
        fetchImages()
        nextTick(() => {
          if (masonryContainer.value) {
            masonryContainer.value.style.width = '100%'
            masonryContainer.value.style.height = 'auto'
          }
          initializeMasonry()

          if (masonryContainer.value) {
            resizeObserver = new ResizeObserver(() => {
              initializeMasonry()
            })
            resizeObserver.observe(masonryContainer.value)
          }
        })
      })

      onBeforeUnmount(() => {
        if (resizeObserver && masonryContainer.value) {
          resizeObserver.unobserve(masonryContainer.value)
        }
      })

      return {
        images,
        isPlaying,
        songTitle,
        songDuration,
        currentProgress,
        thumbnailUrl,
        togglePlayPause,
        playNext,
        playPrevious,
        handleClick,
        handleImageLoad,
        masonryContainer,
      }
    },
  })
</script>

<style scoped>
  .masonry-container {
    display: flex;
    flex-wrap: wrap;
  }

  .masonry-item {
    width: 200px; /* Adjust the width as needed */
    margin-bottom: 16px;
  }

  img {
    width: 100%;
    display: block;
  }
</style>
