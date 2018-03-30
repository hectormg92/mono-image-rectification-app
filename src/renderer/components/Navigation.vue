<template>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="mini"
      dark
      fixed
      app
    >
      <v-list class="pa-1">
        <v-list-tile v-if="mini" @click.stop="mini = !mini">
          <v-list-tile-action>
            <v-icon>chevron_right</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <img src="https://mobilendo.com/wp-content/uploads/2014/03/upv-mobilendo-logo.png" >
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>ETSIGCT</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.stop="mini = !mini">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider light></v-divider>
        <v-list-tile v-for="item in items" :key="item.title" @click="item.click">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <div v-show="!mini">
        <v-card v-for="image in images" :key="image.id" class="mx-3 mt-3" light>
          <v-card-title>{{getBasename(image.path)}}</v-card-title>
          <v-card-media height="150px">
            <img :src="image.path" alt="" style="width: 100%; height: 100%; object-fit: cover;">
          </v-card-media>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-tooltip top>
              <v-btn flat icon light 
                @click="startCapturingControlPoints"
                slot="activator"
                :disabled="actualImage != image.path"
              >
                <v-icon>control_point</v-icon>
              </v-btn>
              <span>Puntos de control</span>
            </v-tooltip>

            <v-tooltip top>
              <v-btn 
                flat icon light 
                @click="actualImage = image.path"
                :disabled="actualImage == image.path"
                slot="activator"
              >
                <v-icon>open_in_new</v-icon>
              </v-btn>
              <span>Abrir imagen</span>
            </v-tooltip>

          </v-card-actions>
        </v-card>
      </div>
    </v-navigation-drawer>
</template>


<script>
  const nodePath = require('path')
  export default {
    data () {
      return {
        items: [
          { title: 'Añadir Imágenes', icon: 'add_a_photo', click: this.openMenuForSelectImages },
        ],
      }
    },

    methods: {
      openMenuForSelectImages() {
        this.$electron.ipcRenderer.send('open-images-menu')
      },
      getBasename(p) {
        return nodePath.basename(p)
      },

      startCapturingControlPoints() {
        console.log('enabled')
      }
    },

    computed: {
      drawer: {
        get() { return this.$store.getters.mainMenuOpened },
        set(opened) { this.$store.dispatch('openMainMenu', opened)}
      },
      mini: {
        get() { return this.$store.getters.miniMenu },
        set(mini) { this.$store.dispatch('setMiniMenu', mini)}
      },
      images: {
        get() { return this.$store.getters.images }
      },
      actualImage: {
        get() { return this.$store.getters.actualImage },
        set(image) { this.$store.dispatch('setActualImage', image)}
      }
    }
  }
</script>