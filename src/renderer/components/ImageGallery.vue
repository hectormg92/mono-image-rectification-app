<template>
  <v-navigation-drawer dark fixed v-model="imagesMenuOpened" disable-resize-watcher>
    <v-list class="pt-0">
      <v-list-tile>
        <v-list-tile-action>
          <v-btn icon @click="$store.dispatch('openImagesMenu', false)">
            <v-icon>arrow_back</v-icon>
          </v-btn>
        </v-list-tile-action>
        <v-list-tile-title>
          <h2>Imágenes</h2>
        </v-list-tile-title>
      </v-list-tile>
      <v-divider></v-divider>
    </v-list>

    <transition-group
      name="scale-transition"
    >
      <app-image-gallery-item
        v-for="(image, idx) in images"
        :key="idx"
        :path="image">
      </app-image-gallery-item>
    </transition-group>

  </v-navigation-drawer>
</template>

<script>
import nodePath from 'path'
import AppImageGalleryItem from './ImageGalleryItem'
export default {

  components: {
    AppImageGalleryItem
  },

  computed: {
    images: {
      get() { return this.$store.getters.images }
    },
    actualImage: {
      get() { return this.$store.getters.actualImage },
      set(image) { this.$store.dispatch('setActualImage', image)}
    },
    imagesMenuOpened: {
      get() { return this.$store.getters.imagesMenuOpened },
      set(opened) { this.$store.dispatch('openImagesMenu', opened)}
    }
  }
}
</script>
