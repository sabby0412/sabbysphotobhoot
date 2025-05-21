const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const takePhotoBtn = document.getElementById("take-photo");
const toggleFilterBtn = document.getElementById("toggle-filter");
const afterCaptureButtons = document.getElementById("after-capture-buttons");
const usePhotoBtn = document.getElementById("use-photo");
const retakePhotoBtn = document.getElementById("retake-photo");
const photoStrip = document.getElementById("photo-strip");
const downloadStripBtn = document.getElementById("download-strip");
const restartBtn = document.getElementById("restart");

let stream = null;
let filter = false;
let photoCount = 0;
let stripImages = [];

navigator.mediaDevices.getUserMedia({ video: true })
  .then(s => {
    stream = s;
    video.srcObject = stream;
  })
  .catch(err => {
    alert("Camera access denied or not available.");
    console.error(err);
  });

toggleFilterBtn.addEventListener("click", () => {
  filter = !filter;
  video.style.filter = filter ? "grayscale(100%)" : "none";
});

takePhotoBtn.addEventListener("click", () => {
  canvas.style.display = "block";
  canvas.getContext("2d").filter = filter ? "grayscale(100%)" : "none";
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  afterCaptureButtons.style.display = "block";
  takePhotoBtn.style.display = "none";
});

retakePhotoBtn.addEventListener("click", () => {
  canvas.style.display = "none";
  afterCaptureButtons.style.display = "none";
  takePhotoBtn.style.display = "inline-block";
});

usePhotoBtn.addEventListener("click", () => {
  if (photoCount >= 4) return;
  const imageData = canvas.toDataURL("image/png");
  const img = document.createElement("img");
  img.src = imageData;
  stripImages.push(img);
  photoStrip.appendChild(img);
  photoCount++;

  canvas.style.display = "none";
  afterCaptureButtons.style.display = "none";
  takePhotoBtn.style.display = photoCount < 4 ? "inline-block" : "none";
});

downloadStripBtn.addEventListener("click", () => {
  if (stripImages.length === 0) return;
  const stripCanvas = document.createElement("canvas");
  stripCanvas.width = 200;
  stripCanvas.height = stripImages.length * 160 + 40;

  const ctx = stripCanvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);

  stripImages.forEach((img, i) => {
    ctx.drawImage(img, 0, i * 160, 200, 150);
  });

  ctx.fillStyle = "#800020";
  ctx.font = "20px Pacifico";
  ctx.fillText("Sabby's cam", 30, stripCanvas.height - 10);

  const link = document.createElement("a");
  link.download = "sabbys-cam-strip.png";
  link.href = stripCanvas.toDataURL();
  link.click();
});

restartBtn.addEventListener("click", () => {
  photoStrip.innerHTML = "";
  photoCount = 0;
  stripImages = [];
  takePhotoBtn.style.display = "inline-block";
});
