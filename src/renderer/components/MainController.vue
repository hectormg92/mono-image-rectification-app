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
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    width: 100vw;
  }

</style>
