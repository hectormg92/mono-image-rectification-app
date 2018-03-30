<template>
  <div ref="renderer" class="renderer"></div>
</template>

<script>
  import Renderer from 'ol/map'
  import View from 'ol/view'
  import Tile from 'ol/tile'
  import Image from 'ol/layer/image'
  import ImageStatic from 'ol/source/imagestatic'
  import Projection from 'ol/proj/projection'

  import ImageUtil from '../utils/image'

  export default {
    data () {
      return {
        renderer: null,
        w: 0,
        h: 0
      }
    },
    mounted() {
      this.renderer = new Renderer({
        target: this.$refs.renderer
      })

      this.renderer.on('click', this.getClickHandler())

      this.$watch(() => this.$store.getters.actualImage, this.processFile)

      // Resize
      this.$watch(() => this.$store.getters.mainMenuOpened, this.onResize)
      this.$watch(() => this.$store.getters.miniMenu, this.onResize)

    },

    methods: {
      onResize() {
        console.log('resize')
        let i = 60;
        const resize = () => {
          if(i--) {
            this.renderer.updateSize()
            window.requestAnimationFrame(resize)
          }
        }
        resize()
      },
      async processFile(path) {
        // console.log(event, event.target, event.target.files)
        // const [ file ] = event.target.files
        // const { path } = file
        if(!path) {
          return
        }

        console.log('PROCESS FILE', path)

        const [w, h] = await ImageUtil.readImage(path)
        this.w = w
        this.h = h

        const layer = this.getLayerImage(path, w, h)
        const view = this.getViewForImage(w, h)

        this.renderer.getLayers().getArray().forEach(l => this.renderer.removeLayer(l))

        this.renderer.setView(view)
        this.renderer.addLayer(layer)
      },

      getViewForImage(w, h) {
        return new View({
          center: [w / 2, h / 2],
          zoom: 2,
          projection: new Projection({
            extent: [0, 0, w, h],
            units: 'pixels'
          }),
          extent: [0, 0, w, h]
        })
      },

      getLayerImage(path, w, h) {
        return new Image({
          source: new ImageStatic({
            url: 'file:///' + path,
            imageExtent: [0, 0, w, h]
          })
        })
      },

      getClickHandler() {
        return ({coordinate: [x, y]}) => {
          const trueY = this.h - y
          console.log(x, trueY)
        }
      }

    }
  }
</script>

<style scoped>
  .renderer {
    background-color: #888;
    width: 100%;
    height: 100%;
  }
</style>
