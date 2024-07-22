<template>
  <div class="player">
    <select v-model="selectedAudio" @change="playAudio">
      <option v-for="audio in audios" :key="audio.url" :value="audio.url">
        {{ audio.title }}
      </option>
    </select>
    <audio ref="audio" controls>
      <source :src="selectedAudio" type="audio/mp3" />
    </audio>
  </div>
</template>

<script>
  export default {
    name: 'Player',
    data() {
      return {
        audios: [],
        selectedAudio: null,
      }
    },
    mounted() {
      fetch('http://localhost:3000/media/audios')
        .then((response) => response.json())
        .then((data) => {
          this.audios = data
          if (data.length > 0) {
            this.selectedAudio = data[0].url
          }
        })
    },
    methods: {
      playAudio() {
        this.$refs.audio.load()
        this.$refs.audio.play()
      },
    },
  }
</script>

<style>
  .player {
    margin-top: 20px;
  }
</style>
