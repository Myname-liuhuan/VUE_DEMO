<template>
  <div class="music-play">
    <div class="thumbnail">
      <img :src="thumbnailUrl" alt="thumbnail" />
    </div>
    <div class="info">
      <div class="title">{{ songTitle }}</div>
      <div class="progress">
        <span>{{ currentProgress }}</span> / <span>{{ songDuration }}</span>
      </div>
    </div>
    <div class="controls">
      <button @click="onPrevious">
        <span>⏮️</span>
      </button>
      <button @click="onPlayPause">
        <span v-if="isPlaying">⏸️</span>
        <span v-else>▶️</span>
      </button>
      <button @click="onNext">
        <span>⏭️</span>
      </button>
    </div>
  </div>
  <audio ref="audioPlayer" :src="audioUrl" @timeupdate="updateMusicNowTime" @ended="onAudioEnd"></audio>
</template>

<script lang="ts">
  import { defineComponent, ref, PropType } from 'vue'

  export default defineComponent({
    name: 'MusicPlay',
    props: {
      playList: {
        type: Array as PropType<any[]>,
        required: true,
      },
      isPlaying: {
        type: Boolean,
        required: true,
      },
      onPlayPause: {
        type: Function as PropType<() => void>,
        required: true,
      },
      onNext: {
        type: Function as PropType<() => void>,
        required: true,
      },
      onPrevious: {
        type: Function as PropType<() => void>,
        required: true,
      },
      songTitle: {
        type: String,
        required: true,
      },
      songDuration: {
        type: String,
        required: true,
      },
      thumbnailUrl: {
        type: String,
        required: true,
      },
      audioUrl: {
        type: String,
        required: true,
      },
    },
    setup() {
      const audioPlayer = ref(null)
      const currentProgress = ref('00:00')

      //播放
      const playAudio = () => {
        if (audioPlayer.value) {
          audioPlayer.value.play()
        }
      }

      //暂停
      const pauseAudio = () => {
        if (audioPlayer.value) {
          audioPlayer.value.pause()
        }
      }

      //播放结束触发事件
      const onAudioEnd = () => {
        let now = new Date()
        console.log('audio end' + now.toLocaleTimeString)
      }

      const updateMusicNowTime = (event) => {
        const audio = event.target
        const currentTime = audio.currentTime
        const minutes = Math.floor(currentTime / 60)
        const seconds = Math.floor(currentTime % 60)
        currentProgress.value = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
      }

      return {
        currentProgress,
        updateMusicNowTime,
        onAudioEnd,
        playAudio,
        pauseAudio,
      }
    },
  })
</script>

<style scoped>
  .music-play {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .thumbnail {
    width: 60px;
    height: 60px;
    margin-right: 10px;
  }

  .thumbnail img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
  }

  .info {
    flex-grow: 1;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .progress {
    font-size: 14px;
    color: #666;
  }

  .controls {
    display: flex;
    align-items: center;
  }

  .controls button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    margin: 0 5px;
    padding: 5px;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .controls button:hover {
    background: rgba(0, 0, 0, 0.1);
  }
</style>
