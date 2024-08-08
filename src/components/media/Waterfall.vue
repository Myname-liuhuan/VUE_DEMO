<template>
  <div>
    <div ref="masonryContainer" class="masonry-container">
      <div v-for="(image, index) in images" :key="image.id" class="masonry-item" @click="handleClick(index)">
        <img :src="image.imageUrl" @load="handleImageLoad" />
      </div>
    </div>
    <!-- musicPlayRef用于获取子组件对象好调用其中方法 -->
    <MusicPlay
      ref="musicPlayRef"
      :is-playing="isPlaying"
      :on-play-pause="togglePlayPause"
      :on-next="playNext"
      :on-previous="playPrevious"
      :song-title="songTitle"
      :song-duration="songDuration"
      :thumbnail-url="thumbnailUrl"
      :audio-url="audioUrl"
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
      let playList = [] //播放列表
      const images = ref([])
      const isPlaying = ref(false)
      const songTitle = ref('龙卷风-dzq')
      const songDuration = ref('5:00')
      const thumbnailUrl = ref('https://www.runoob.com/wp-content/themes/runoob/assets/images/qrcode.png')
      const audioUrl = ref('https://sis-sample-audio.obs.cn-north-1.myhuaweicloud.com/16k16bit.mp3')
      const masonryContainer = ref<HTMLElement | null>(null)
      let resizeObserver: ResizeObserver | null = null
      const musicPlayRef = ref<InstanceType<typeof MusicPlay> | null>(null) //获取标签中的ref='musicPlayRef'

      //播放或者暂停
      const togglePlayPause = () => {
        if (isPlaying.value) {
          //播放转暂停
          isPlaying.value = false
          musicPlayRef.value.pauseAudio()
        } else {
          //暂停转播放
          isPlaying.value = true
          musicPlayRef.value.playAudio()
        }
      }

      //下一首
      const playNext = async () => {
        if (playList && playList.length > 1) {
          let index = playList.indexOf(audioUrl.value)
          if (index == playList.length - 1) {
            index = 0
          } else {
            index++
          }
          audioUrl.value = playList[index]
          //如果当前是播放状态,就自动播放
          if (isPlaying.value) {
            await nextTick()
            musicPlayRef.value.playAudio()
          }
        }
      }

      //上一首
      const playPrevious = async () => {
        if (playList && playList.length > 1) {
          let index = playList.indexOf(audioUrl.value)
          if (index == 0) {
            index = playList.length - 1
          } else {
            index--
          }
          audioUrl.value = playList[index]
          //如果当前是播放状态,就自动播放
          if (isPlaying.value) {
            await nextTick()
            musicPlayRef.value.playAudio()
          }
        }
      }

      //瀑布流点击事件
      const handleClick = async (index: number) => {
        let musicUrl = images.value[index].musicUrl
        audioUrl.value = musicUrl
        //如果播放列表中存在该歌曲，则删除
        if (playList.includes(musicUrl)) {
          playList = playList.filter((item) => item !== musicUrl)
        }
        playList.unshift(musicUrl)
        //开始播放
        isPlaying.value = true
        //等待dom更新完成
        await nextTick()
        musicPlayRef.value.playAudio()
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
        thumbnailUrl,
        audioUrl,
        togglePlayPause,
        playNext,
        playPrevious,
        handleClick,
        handleImageLoad,
        masonryContainer,
        musicPlayRef,
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
