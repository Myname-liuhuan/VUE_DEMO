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
  <audio ref="audioPlayer" :src="audioUrl" @timeupdate="updateTime" @ended="onAudioEnd"></audio>
</template>

<script lang="ts">
  import { defineComponent, ref, PropType, watch } from 'vue'

  export default defineComponent({
    name: 'MusicPlay',
    props: {
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
      currentProgress: {
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

    setup(props) {
      const audioPlayer = ref<HTMLAudioElement | null>(null)
      const currentTime = ref(0)

      const playAudio = () => {
        if (audioPlayer.value) {
          audioPlayer.value.play()
        }
      }

      const pauseAudio = () => {
        if (audioPlayer.value) {
          audioPlayer.value.pause()
        }
      }

      const togglePlayPause = () => {
        if (props.isPlaying) {
          pauseAudio()
        } else {
          playAudio()
        }
        props.onPlayPause()
      }

      const updateTime = () => {
        if (audioPlayer.value) {
          currentTime.value = audioPlayer.value.currentTime
        }
      }

      const onAudioEnd = () => {
        props.onNext()
      }

      watch(
        () => props.isPlaying,
        (newVal) => {
          if (newVal) {
            playAudio()
          } else {
            pauseAudio()
          }
        },
      )

      const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
      }

      return {
        audioPlayer,
        currentTime,
        togglePlayPause,
        updateTime,
        onAudioEnd,
        formatTime,
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
