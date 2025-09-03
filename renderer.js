const { ipcRenderer } = require("electron");

const selectBtn = document.getElementById("selectBtn");
const convertBtn = document.getElementById("convertBtn");
const imageList = document.getElementById("imageList");
const status = document.getElementById("status");

let selectedImages = [];

selectBtn.addEventListener("click", async () => {
  const files = await ipcRenderer.invoke("select-images");
  if (files && files.length > 0) {
    selectedImages = files;
    imageList.innerHTML = files.map(f => `<li>${f}</li>`).join("");
    convertBtn.disabled = false;
  }
});

convertBtn.addEventListener("click", async () => {
  status.textContent = "Converting...";
  const result = await ipcRenderer.invoke("save-pdf", selectedImages);

  if (!result) {
    status.textContent = "❌ Cancelled";
  } else if (result.error) {
    status.textContent = `❌ Error: ${result.error}`;
  } else {
    status.textContent = `✅ Saved: ${result}`;
  }
});
