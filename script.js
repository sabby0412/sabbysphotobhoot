const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const useBtn = document.getElementById('useBtn');
const retakeBtn = document.getElementById('retakeBtn');
const downloadBtn = document.getElementById('downloadBtn');
const restartBtn = document.getElementById('restartBtn');
const photoStrip = document.getElementById('photo-strip');
const previewOptions = document.getElementById('preview-options');
const toggleFilterBtn = document.getElementById('toggleFilterBtn');

let stream = null;
let currentFilter = false;
let photoCount = 0;

async function initCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (error) {
    alert('Camera access denied or not available.');
  }
}

initCamera();

takePhotoBtn.addEventListener('click', () => {
  canvas.getContext('2d').filter = currentFilter ? 'grayscale(100%)' : 'none';
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.style.display = 'block';
  video.style.display = 'none';
  previewOptions.classList.remove('hidden');
});

useBtn.addEventListener('click', () => {
  const img = document.createElement('img');
  img.src = canvas.toDataURL('image/png');
  photoStrip.appendChild(img);

  photoCount++;
  if (photoCount >= 4) {
    downloadBtn.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
  }

  canvas.style.display = 'none';
  video.style.display = 'block';
  previewOptions.classList.add('hidden');
});

retakeBtn.addEventListener('click', () => {
  canvas.style.display = 'none';
  video.style.display = 'block';
  previewOptions.classList.add('hidden');
});

toggleFilterBtn.addEventListener('click', () => {
  currentFilter = !currentFilter;
  toggleFilterBtn.textContent = 'Black & White: ' + (currentFilter ? 'ON' : 'OFF');
});

downloadBtn.addEventListener('click', () => {
  const stripCanvas = document.createElement('canvas');
  stripCanvas.width = 200;
  stripCanvas.height = 4 * 150 + 60;

  const ctx = stripCanvas.getContext('2d');
  const images = photoStrip.querySelectorAll('img');
  images.forEach((img, index) => {
    ctx.drawImage(img, 0, index * 150, 200, 150);
  });

  ctx.fillStyle = '#800020';
  ctx.font = '16px Playfair Display';
  ctx.fillText("Sabby's Cam", 40, stripCanvas.height - 10);

  const link = document.createElement('a');
  link.download = 'photostrip.png';
  link.href = stripCanvas.toDataURL();
  link.click();
});

restartBtn.addEventListener('click', () => {
  photoStrip.innerHTML = '';
  photoCount = 0;
  downloadBtn.classList.add('hidden');
  restartBtn.classList.add('hidden');
});
