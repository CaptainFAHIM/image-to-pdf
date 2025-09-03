const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { createPdf } = require("./utils/pdf");

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "renderer.js"),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => createWindow());

ipcMain.handle("select-images", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "bmp", "webp", "gif", "heic"] }]
  });
  return result.filePaths;
});

ipcMain.handle("save-pdf", async (event, images) => {
  const { filePath } = await dialog.showSaveDialog({
    defaultPath: "output.pdf",
    filters: [{ name: "PDF", extensions: ["pdf"] }]
  });

  if (filePath) {
    try {
      await createPdf(images, filePath);
      return filePath;
    } catch (err) {
      return { error: err.message };
    }
  }
  return null;
});
