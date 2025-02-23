// JavaScript код
async function setupCamera() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    await video.play();
}

async function loadModel() {
    const model = await cocoSsd.load();
    return model;
}

async function predict(model, video) {
    const predictions = await model.detect(video);
    return predictions.filter(prediction => prediction.class === 'wheel');
}

function drawWheels(predictions, canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    predictions.forEach(prediction => {
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        const width = prediction.bbox[2];
        const height = prediction.bbox[3];

        const wheelImage = new Image();
        wheelImage.src = 'assets/wheel.png';

        wheelImage.onload = () => {
            const resizedWidth = width * 0.8;
            const resizedHeight = height * 0.8;

            ctx.drawImage(wheelImage,
                x + (width - resizedWidth) / 2,
                y + (height - resizedHeight) / 2,
                resizedWidth,
                resizedHeight);
        };
    });
}

async function main() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('overlay');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    await setupCamera();
    const model = await loadModel();

    setInterval(async () => {
        const predictions = await predict(model, video);
        drawWheels(predictions, canvas);
    }, 100);
}

main();
