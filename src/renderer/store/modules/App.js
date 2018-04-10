const state = {
  renderer: null,
  imagesMenuOpened: false,
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
const OPEN_IMAGES_MENU = 'OPEN_IMAGES_MENU'
const SET_MINI_MENU_MUTATION = 'SET_MINI_MENU'

const DELETE_IMAGE_MUTATION = 'DELETE_IMAGE'


const mutations = {
  [SET_RENDERER_MUTATION] (state, renderer) {
    console.log('MUTATION SET RENDERER', renderer)
    state.renderer = renderer
  },

  [SET_ACTUAL_IMAGE_MUTATION] (state, image) {
    state.actualImage = image
  },

  [ADD_IMAGES_MUTATION] (state, images) {
    // console.log(images.map(path => ({ path, id: imageId++ }) ))
    for(const path of images) {
      if(state.images.findIndex(p => p == path) == -1) {
        state.images.push(path)
      }
    }
  },

  [DELETE_IMAGE_MUTATION](state, image) {
    const idx = state.images.findIndex(path => path == image)
    state.images.splice(idx, 1)
  },

  [OPEN_MAIN_MENU_MUTATION] (state, opened) {
    state.mainMenuOpened = opened;
  },

  [SET_MINI_MENU_MUTATION] (state, mini) {
    state.miniMenu = mini
  },

  [OPEN_IMAGES_MENU] (state, opened) {
    state.imagesMenuOpened = opened;
  },
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

  deleteImage({commit}, image) {
    commit(DELETE_IMAGE_MUTATION, image)
  },

  openMainMenu({commit}, opened) {
    commit(OPEN_MAIN_MENU_MUTATION, opened)
  },

  setMiniMenu({commit}, mini) {
    commit(SET_MINI_MENU_MUTATION, mini)
  },

  openImagesMenu({commit}, opened) {
    if(opened) {
      commit(SET_MINI_MENU_MUTATION, false)
      // commit(OPEN_MAIN_MENU_MUTATION, true)
    }
    commit(OPEN_IMAGES_MENU, opened)
  }
}

const getters = {
  renderer({renderer}) {
    return renderer
  },
  actualImage({actualImage}) {
    return actualImage
  },

  images({images}) {
    return images
  },

  mainMenuOpened({mainMenuOpened}) {
    return mainMenuOpened
  },

  miniMenu({miniMenu}) {
    return miniMenu
  },

  imagesMenuOpened({imagesMenuOpened}) {
    return imagesMenuOpened
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
