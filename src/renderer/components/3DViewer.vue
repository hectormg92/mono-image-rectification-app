<template>
  <div ref="container"></div>
</template>

<script>
import * as THREE from 'three'
import OBJLoader from 'three-obj-loader'
import OrbitControls from 'three-orbitcontrols'
import MTLLoader from 'three-mtl-loader'

OBJLoader(THREE)

const objLoader = new THREE.OBJLoader()

export default {
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mouseX: 0,
      mouseY: 0,
      windowHalfX: 0,
      windowHalfY: 0
    }
  },
  created() {
    this.$electron.ipcRenderer.on('load-obj', this.loadOBJ)
    this.$electron.ipcRenderer.on('load-mtl-obj', this.loadMTL)
  },
  mounted() {

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
    this.camera.position.z = 250

    // scene
    this.scene = new THREE.Scene()
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
    this.scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 0.8)

    this.camera.add(pointLight)
    this.scene.add(this.camera)

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.$refs.container.appendChild(this.renderer.domElement)

    // document.addEventListener( 'mousemove', this.onDocumentMouseMove, false )
    window.addEventListener('resize', this.onWindowResize, false)

    var controls = new OrbitControls(this.camera, this.camera.domElement)

    this.animate()

  },

  methods: {
    loadOBJ(event, path, materials) {
      
      if(materials) objLoader.setMaterials(materials)

      objLoader.load(path, object => {
        object.position.set(0, 0, 0)

        this.scene.add(object)
      },
      progress => console.log(progress), error => console.log(error))
    },

    loadMTL(event, [obj, mtl]) {
      const mtlLoader = new MTLLoader()

      mtlLoader.load(mtl, material => {
        material.preload()

        this.loadOBJ(null, obj, material)
      })

    },

    animate() {
      requestAnimationFrame(this.animate)
      this.render()
    },

    render() {
      // this.camera.position.x += ( this.mouseX - this.camera.position.x ) * .05
      // this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * .05
      this.camera.lookAt(this.scene.position)
      this.renderer.render(this.scene, this.camera)
    },

    onDocumentMouseMove( event ) {
      this.mouseX = ( event.clientX - this.windowHalfX ) / 2
      this.mouseY = ( event.clientY - this.windowHalfY ) / 2
    },

    onWindowResize() {
      this.windowHalfX = window.innerWidth / 2
      this.windowHalfY = window.innerHeight / 2
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize( window.innerWidth, window.innerHeight )
    }
  }
}
</script>
