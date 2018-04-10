<template>
  <div style="width: 100%; height: 100%;">
    <renderer></renderer>
  </div>
</template>

<script>
  import Renderer from './Renderer'

  export default {
    name: 'main-controller',
    components: {
      Renderer
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Roboto', sans-serif; }
  
</style>
