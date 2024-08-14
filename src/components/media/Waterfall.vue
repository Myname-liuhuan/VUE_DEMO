<template>
  <div>
    <div ref="masonryContainer" class="masonry-container">
      <div v-for="(image, index) in images" :key="image.id" class="masonry-item" @click="handleClick(index)">
        <img :src="image.imageUrl" @load="handleImageLoad" />
        <span>{{ image.musicName + '-' + image.singerName }}</span>
      </div>
    </div>
    <!-- musicPlayRef用于获取子组件对象好调用其中方法 -->
    <MusicPlay
      ref="musicPlayRef"
      :is-playing="isPlaying"
      :on-play-pause="togglePlayPause"
      :on-next="playNext"
      :on-previous="playPrevious"
      :on-audio-end="onAudioEnd"
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
      const songDuration = ref('00:00')
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
          let index = -1
          for (let i = 0; i < playList.length; i++) {
            if (playList[i]['musicUrl'] == audioUrl.value) {
              index = i
              break
            }
          }

          if (index == playList.length - 1) {
            index = 0
          } else {
            index++
          }
          audioUrl.value = playList[index]['musicUrl']
          songDuration.value = playList[index]['songDuration']
          thumbnailUrl.value = playList[index]['thumbnailUrl']
          songTitle.value = playList[index]['songTitle']
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
          let index = -1
          for (let i = 0; i < playList.length; i++) {
            if (playList[i]['musicUrl'] == audioUrl.value) {
              index = i
              break
            }
          }

          if (index == 0) {
            index = playList.length - 1
          } else {
            index--
          }
          audioUrl.value = playList[index]['musicUrl']
          songDuration.value = playList[index]['songDuration']
          thumbnailUrl.value = playList[index]['thumbnailUrl']
          songTitle.value = playList[index]['songTitle']
          //如果当前是播放状态,就自动播放
          if (isPlaying.value) {
            await nextTick()
            musicPlayRef.value.playAudio()
          }
        }
      }

      //播放结束触发事件
      const onAudioEnd = () => {
        let now = new Date()
        console.log('audio end ' + now.toLocaleString())

        //修改播放ui显示为暂停
        isPlaying.value = false
      }

      //瀑布流点击事件
      const handleClick = async (index: number) => {
        //修改时长
        let minutes = Math.floor(images.value[index].musicTimeLength / 60)
        let second = images.value[index].musicTimeLength % 60
        let musicPlayJson = {}
        musicPlayJson['musicUrl'] = images.value[index].musicUrl
        musicPlayJson['songDuration'] = (minutes < 10 ? '0' + minutes : minutes) + ':' + (second < 10 ? '0' + second : second)
        musicPlayJson['thumbnailUrl'] = images.value[index].miniImageUrl
        musicPlayJson['songTitle'] = images.value[index].musicName + '-' + images.value[index].singerName

        //修改audio标签播放源
        audioUrl.value = musicPlayJson['musicUrl']
        songDuration.value = musicPlayJson['songDuration']
        thumbnailUrl.value = musicPlayJson['thumbnailUrl']
        songTitle.value = musicPlayJson['songTitle']
        //如果播放列表中存在该歌曲，则删除
        if (playList.includes(musicPlayJson)) {
          playList = playList.filter((item) => item !== musicPlayJson)
        }
        playList.unshift(musicPlayJson)
        //开始播放
        isPlaying.value = true
        //等待dom更新完成
        await nextTick()
        musicPlayRef.value.playAudio()
      }

      const fetchImages = async () => {
        try {
          let pageNum = 1
          let pageSize = 30
          const response = await axios.get('/api/media/music/pageListJoinSong?pageNum=' + pageNum + '&pageSize=' + pageSize)
          if (response.status === 200) {
            images.value = response.data.data.records
          } else {
            console.error('Failed to fetch images')
          }
        } catch (error) {
          console.error('Error fetching images:', error)
        }
      }

      const handleImageLoad = () => {
        nextTick(() => {
          initializeMasonry()
        })
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
        onAudioEnd,
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
    position: relative;
    text-align: center;
    width: 200px; /* Adjust the width as needed */
    margin-left: 10px;
    margin-top: 5px;
  }
  /* 让文本悬浮于图片中 样式被注释，启用修改p为span*/
  .masonry-item p {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white; /* 如果需要的话，设置文本颜色 */
    font-size: 14px; /* 调整文本大小 */
    background-color: rgba(0, 0, 0, 0.5); /* 添加背景色使文本更清晰 */
    padding: 5px; /* 给文本添加内边距 */
    border-radius: 5px; /* 添加圆角 */
  }

  img {
    width: 100%;
    display: block;
  }
</style>
