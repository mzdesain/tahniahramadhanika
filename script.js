const twibbonImg = document.getElementById("twibbonImg");
const inputName = document.getElementById("inputName");
const inputPosition = document.getElementById("inputPosition");
const downloadBtn = document.getElementById("downloadBtn");

function updateText() {
    document.getElementById("name").innerText = inputName.value || "Nama";
    document.getElementById("position").innerText = inputPosition.value || "Keterangan";
    downloadBtn.disabled = !(inputName.value || inputPosition.value);
}

async function loadImage(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Gagal memuat gambar. Pastikan URL gambar mengizinkan akses cross-origin."));
    });
}

async function downloadTwibbon() {

     const popup = document.getElementById("downloadPopup");
    try {

        popup.classList.add("active");
        let img = await loadImage(twibbonImg.src);

        let CANVAS_WIDTH = img.width;
        let CANVAS_HEIGHT = img.height;

        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        await document.fonts.ready;

        ctx.fillStyle = "#000000";

        const nameFontSize = (7 / 400) * CANVAS_HEIGHT;
        const positionFontSize = (5 / 400) * CANVAS_HEIGHT;

        // ======================
        // NAMA (letter spacing -1px)
        // ======================

        ctx.font = `bold ${nameFontSize}px 'Montserrat', sans-serif`;
        ctx.textAlign = "left"; // penting karena kita center manual

        const nameY = CANVAS_HEIGHT - (CANVAS_HEIGHT * 0.17);

        drawTextSpacing(
            ctx,
            inputName.value || "Nama",
            CANVAS_WIDTH / 2,
            nameY,
            -6 // FIX: letter spacing -1px
        );

        // ======================
        // POSITION (normal center)
        // ======================

        ctx.font = `${positionFontSize}px 'Montserrat', sans-serif`;
        ctx.textAlign = "center";

        const positionY = nameY + (1.1 * positionFontSize);

        ctx.fillText(
            inputPosition.value || "Keterangan",
            CANVAS_WIDTH / 2,
            positionY
        );

        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "Tahniah IKA STIBA.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    setTimeout(() => {
            popup.classList.remove("active");
        }, 800);

    } catch (error) {
        alert(error.message);
    }
}


// ======================
// FUNGSI LETTER SPACING
// ======================

function drawTextSpacing(ctx, text, centerX, y, spacing) {

    let totalWidth = 0;

    for (let i = 0; i < text.length; i++) {
        totalWidth += ctx.measureText(text[i]).width + spacing;
    }

    totalWidth -= spacing;

    let startX = centerX - (totalWidth / 2);

    for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], startX, y);
        startX += ctx.measureText(text[i]).width + spacing;
    }
}
