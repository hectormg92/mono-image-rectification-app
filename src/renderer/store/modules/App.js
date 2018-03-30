const state = {
  renderer: null,
  mainMenuOpened: false,
  miniMenu: false,
  actualImage: null,
  controlPoints: {},
  images: []
}

let imageId = 0

const SET_RENDERER_MUTATION = 'SET_RENDERER'
const SET_ACTUAL_IMAGE_MUTATION = 'SET_ACTUAL_IMAGE'
const ADD_IMAGES_MUTATION = 'ADD_IMAGES'
const OPEN_MAIN_MENU_MUTATION = 'OPEN_MAIN_MENU'
const SET_MINI_MENU_MUTATION = 'SET_MINI_MENU'

const mutations = {
  [SET_RENDERER_MUTATION] (state, renderer) {
    console.log('MUTATION SET RENDERER', renderer)
    state.renderer = renderer
  },

  [SET_ACTUAL_IMAGE_MUTATION] (state, image) {
    state.actualImage = image
  },

  [ADD_IMAGES_MUTATION] (state, images) {
    console.log(images.map(path => ({ path, id: imageId++ }) ))
    state.images.push(...images.map(path => ({ path, id: imageId++ }) ))
  },

  [OPEN_MAIN_MENU_MUTATION] (state, opened) {
    state.mainMenuOpened = opened;
  },

  [SET_MINI_MENU_MUTATION] (state, mini) {
    state.miniMenu = mini
  }
}

const actions = {
  setRenderer ({ commit }, renderer) {
    console.log('ACTION ST RENDERER', renderer)
    commit(SET_RENDERER_MUTATION, renderer)
  },
  setActualImage ({ commit }, image) {
    console.log('SET ACTUAL IMAGE', image)
    commit(SET_ACTUAL_IMAGE_MUTATION, image)
  },

  setImages({commit}, images) {
    commit(ADD_IMAGES_MUTATION, images)
  },

  openMainMenu({commit}, opened) {
    commit(OPEN_MAIN_MENU_MUTATION, opened)
  },

  setMiniMenu({commit}, mini) {
    commit(SET_MINI_MENU_MUTATION, mini)
  }
}

const getters = {
  renderer(state) {
    return state.renderer
  },
  actualImage(state) {
    return state.actualImage
  },

  images(state) {
    return state.images
  },

  mainMenuOpened(state) {
    return state.mainMenuOpened
  },

  miniMenu(state) {
    return state.miniMenu
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
