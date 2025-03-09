const { app, BrowserWindow, ipcMain, dialog } = require("electron")
const path = require("path")
const fs = require("fs")
const yaml = require("js-yaml")
const k8s = require("@kubernetes/client-node")

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // In production, load the bundled React app
  // In development, connect to the React dev server
  const startUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`

  mainWindow.loadURL(startUrl)

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// Handle IPC messages from the renderer
ipcMain.handle("load-kubeconfig", async () => {
  try {
    // Try to load from default location first
    const homeDir = app.getPath("home")
    const defaultKubeconfig = path.join(homeDir, ".kube", "config")

    if (fs.existsSync(defaultKubeconfig)) {
      const configContent = fs.readFileSync(defaultKubeconfig, "utf8")
      return { success: true, config: configContent }
    } else {
      // If default doesn't exist, ask user to select a file
      const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "Select kubeconfig file",
        properties: ["openFile"],
      })

      if (canceled || filePaths.length === 0) {
        return { success: false, error: "No kubeconfig selected" }
      }

      const configContent = fs.readFileSync(filePaths[0], "utf8")
      return { success: true, config: configContent }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("get-clusters", async (event, kubeconfig) => {
  try {
    const kc = new k8s.KubeConfig()
    kc.loadFromString(kubeconfig)

    return {
      success: true,
      clusters: kc.clusters.map((cluster) => ({
        name: cluster.name,
        server: cluster.server,
      })),
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// Add more IPC handlers for Kubernetes operations

