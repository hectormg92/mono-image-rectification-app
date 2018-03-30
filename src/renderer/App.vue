<template>

  <div id="app">
    <v-app>
      <app-navigation></app-navigation>
      <v-content style="max-height: 100vh;">
          <router-view></router-view>
        <!-- <v-container fill-height class="pa-0 ma-0" style="max-height: 100vh;">
          <v-layout justify-center>
          </v-layout>
        </v-container> -->
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import AppNavigation from './components/Navigation'

  export default {
    name: 'patrimonio-electron-vue',
    created() {
      this.$electron.ipcRenderer.on('toggle-main-menu', () => {
        console.log('Main Menu Open')
        this.$store.dispatch('openMainMenu', !this.$store.getters.mainMenuOpened)
      })

      this.$electron.ipcRenderer.on('load-images', (event, images) => {
        console.log('images', images)
        this.$store.dispatch('setImages', images)
      })
    },
    components: {
      AppNavigation
    },
    computed: {
      drawer: {
        get() { return this.$store.getters.mainMenuOpened },
        set(opened) { this.$store.dispatch('openMainMenu', opened)}
      },
    }
  }
</script>

<style>
  /* CSS */
</style>
