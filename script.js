const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const takePhotoBtn = document.getElementById('takePhoto');
const downloadStripBtn = document.getElementById('downloadStrip');
const restartBtn = document.getElementById('restartBtn');
const strip = document.getElementById('strip');
const bwToggle = document.getElementById('bwToggle');

const confirmModal = document.getElementById('confirmModal');
const keepPhotoBtn = document.getElementById('keepPhotoBtn');
const retakePhotoBtn = document.getElementById('retakePhotoBtn');

let photosTaken = 0;
let photoData = [];
let tempPhotoSrc = null;

// Access camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert('Camera access denied or not available. Please check your browser settings.');
  });

// Toggle black & white filter live on video
bwToggle.addEventListener('change', () => {
  if (bwToggle.checked) {
    video.classList.add('bw');
  } else {
    video.classList.remove('bw');
  }
});

takePhotoBtn.addEventListener('click', () => {
  if (photosTaken >= 4) return;

  // Draw video frame to canvas
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // If BW toggled, apply grayscale filter to canvas image data
  if (bwToggle.checked) {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // Get image data url
  tempPhotoSrc = canvas.toDataURL('image/png');

  // Show confirm modal
  confirmModal.classList.add('active');
  takePhotoBtn.disabled = true;
  bwToggle.disabled = true;
});

keepPhotoBtn.addEventListener('click', () => {
  // Add photo to strip and data array
  const img = new Image();
  img.src = tempPhotoSrc;
  img.onload = () => {
    strip.appendChild(img);
    photoData.push(tempPhotoSrc);
    photosTaken++;

    if (photosTaken >= 4) {
      downloadStripBtn.classList.remove('hidden');
      restartBtn.classList.remove('hidden');
      takePhotoBtn.classList.add('hidden');
    }
  };

  // Hide modal & re-enable buttons
  confirmModal.classList.remove('active');
  takePhotoBtn.disabled = false;
  bwToggle.disabled = false;
});

retakePhotoBtn.addEventListener('click', () => {
  // Just hide modal & allow retake
  confirmModal.classList.remove('active');
  takePhotoBtn.disabled = false;
  bwToggle.disabled = false;
});

downloadStripBtn.addEventListener('click', () => {
  if (photoData.length === 0) return;

  // Create a canvas tall enough for all 4 photos stacked vertically
  const stripCanvas = document.createElement('canvas');
  const stripCtx = stripCanvas.getContext('2d');
  const photoWidth = 200;
  const photoHeight = 150;
  stripCanvas.width = photoWidth;
  stripCanvas.height = photoHeight * photoData.length;

  // Draw each photo on the strip canvas vertically
  let imagesLoaded = 0;
  photoData.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      stripCtx.drawImage(img, 0, index * photoHeight, photoWidth, photoHeight);
      imagesLoaded++;
      if (imagesLoaded === photoData.length) {
        // When all images drawn, trigger download
        const link = document.createElement('a');
        link.href = stripCanvas.toDataURL('image/png');
        link.download = 'photo-strip.png';
        link.click();
      }
    };
  });
});

restartBtn.addEventListener('click', () => {
  // Reset everything
  photosTaken = 0;
  photoData = [];
  strip.innerHTML = '';
  downloadStripBtn.classList.add('hidden');
  restartBtn.classList.add('hidden');
  takePhotoBtn.classList.remove('hidden');
  takePhotoBtn.disabled = false;
  bwToggle.disabled = false;
});
