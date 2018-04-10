<template>
  <v-card 
    class="mx-3 mt-3" 
    :color="path == actualImage ? 'green' : 'white'" 
    :dark="path == actualImage" 
    :light="path != actualImage"
  >
    <v-card-title>
      {{getBasename(path)}}
    </v-card-title>
    <v-card-media height="150px">
      <img :src="path" alt="" style="width: 100%; height: 100%; object-fit: cover;">
    </v-card-media>
    <v-card-actions>

      <v-tooltip top>
        <v-btn 
          flat icon 
          :dark="path == actualImage"
          :light="path != actualImage"
          @click="deleteImage(path)"
          slot="activator"
          :disabled="actualImage == path"
        >
          <v-icon color="red">delete</v-icon>
        </v-btn>
        <span>Eliminar Imagen</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <v-tooltip top>
        <v-btn 
          flat icon 
          :dark="path == actualImage"
          :light="path != actualImage"
          @click="startCapturingControlPoints"
          slot="activator"
          :disabled="actualImage != path"
        >
          <v-icon>control_point</v-icon>
        </v-btn>
        <span>Puntos de control</span>
      </v-tooltip>


      <v-tooltip top>
        <v-btn 
          flat icon 
          :dark="path == actualImage"
          :light="path != actualImage"
          @click="actualImage = path"
          :disabled="actualImage == path"
          slot="activator"
        >
          <v-icon>open_in_new</v-icon>
        </v-btn>
        <span>Abrir imagen</span>
      </v-tooltip>

    </v-card-actions>
  </v-card>
</template>

<script>
import nodePath from 'path'

export default {
  props: ['path'],
  methods: {
    getBasename(p) {
      return nodePath.basename(p)
    },

    startCapturingControlPoints() {
      console.log('enabled')
    },

    deleteImage(image) {
      this.$store.dispatch('deleteImage', image)
    }
  },

  computed: {
    actualImage: {
      get() { return this.$store.getters.actualImage },
      set(image) { this.$store.dispatch('setActualImage', image)}
    }
  }
}
</script>
