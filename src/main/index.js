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
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(menuTemplate)

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

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

  // console.log(result, 'result')
  mainWindow.webContents.send('load-images', result)
}