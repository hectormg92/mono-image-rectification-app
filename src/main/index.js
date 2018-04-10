import electron, { app, BrowserWindow } from 'electron'

const { Menu, ipcMain, dialog } = electron

const menuTemplate = [
  {
    label: 'Archivo',
    submenu: [
      {
        label: 'Alternar Menú',
        click: openApplicationMenu
      },
      {
        label: 'Añadir Imágenes',
        click: loadImages
      },
      {
        label: 'Abrir Visor 3D',
        click: create3DWindow
      }
    ]
  }
]

const menuTemplate3DViewer = [
  {
    label: 'Archivo',
    submenu: [
      {
        label: 'Abrir OBJ',
        click: openOBJ
      },
      {
        label: 'Abrir MTL+OBJ',
        click: openMTL
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(menuTemplate)
const menu3DViewer = Menu.buildFromTemplate(menuTemplate3DViewer)


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, window3D

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

  const win3DURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#3dviewer`
  : `file://${__dirname}/index.html#3dviewer`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  Menu.setApplicationMenu(menu)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
*/

ipcMain.on('open-images-menu', loadImages)


function openApplicationMenu() {
  mainWindow.webContents.send('toggle-main-menu')
}

function loadImages() {
  const result = dialog.showOpenDialog(mainWindow, {
    title: 'Añadir imágenes al proyecto',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Imágenes (PNG, JPG)', extensions: ['png', 'jpg'] }]
  })

  if(!result) {
    return
  }
  
  // console.log(result, 'result')
  mainWindow.webContents.send('load-images', result)
}

function create3DWindow() {
  window3D = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      webSecurity: false
    }
  })

  window3D.loadURL(win3DURL)

  window3D.on('closed', () => {
    window3D = null
  })

  window3D.setMenu(menu3DViewer)
}

function openOBJ() {
  const result = dialog.showOpenDialog(window3D, {
    title: 'Abrir objeto 3D',
    properties: ['openFile'],
    filters: [{ name: '3D Object (OBJ)', extensions: ['obj'] }]
  })

  if(!result) {
    return
  }
  console.log(result[0])
  window3D.webContents.send('load-obj', result[0])
  
}

function openMTL() {
  const result = dialog.showOpenDialog(window3D, {
    title: 'Abrir objeto 3D',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Material (MTL) and 3D Object (OBJ)', extensions: ['mtl', 'obj'] }]
  })

  if(!result || result.length != 2) { return }

  const obj = result.find(p => p.endsWith('.obj'))
  const mtl = result.find(p => p.endsWith('.mtl'))

  if(!obj || !mtl) { return }

  window3D.webContents.send('load-mtl-obj', [obj, mtl])

}