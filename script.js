const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const takePhotoBtn = document.getElementById('takePhoto');
const downloadStripBtn = document.getElementById('downloadStrip');
const restartBtn = document.getElementById('restartBtn');
const strip = document.getElementById('strip');
const bwToggle = document.getElementById('bwToggle');

let photosTaken = 0;
let photoData = [];

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert('Camera access denied or not available. Please check your browser settings.');
  });

takePhotoBtn.addEventListener('click', () => {
  if (photosTaken >= 4) return;

  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  
  if (bwToggle.checked) {
    let ctx = canvas.getContext('2d');
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  const img = new Image();
  img.src = canvas.toDataURL('image/png');
  img.onload = () => {
    strip.appendChild(img);
    photoData.push(img.src);
    photosTaken++;

    if (photosTaken >= 4) {
      downloadStripBtn.classList.remove('hidden');
      restartBtn.classList.remove('hidden');
      takePhotoBtn.classList.add('hidden');
    }
  };
});

downloadStripBtn.addEventListener('click', () => {
  const stripCanvas = document.createElement('canvas');
  stripCanvas.width = 200;
  stripCanvas.height = 500;
  const ctx = stripCanvas.getContext('2d');

  photoData.forEach((src, i) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      ctx.drawImage(img, 0, i * 125, 200, 125);
      if (i === photoData.length - 1) {
        // Add "Sabby's Cam"
        ctx.font = "20px Great Vibes";
        ctx.fillStyle = "#800020";
        ctx.textAlign = "center";
        ctx.fillText("Sabby's Cam", 100, 490);

        const a = document.createElement('a');
        a.href = stripCanvas.toDataURL('image/png');
        a.download = 'sabbys-strip.png';
        a.click();
      }
    };
  });
});

restartBtn.addEventListener('click', () => {
  strip.innerHTML = '';
  photoData = [];
  photosTaken = 0;
  downloadStripBtn.classList.add('hidden');
  restartBtn.classList.add('hidden');
  takePhotoBtn.classList.remove('hidden');
});
