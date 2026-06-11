// ==========================================
// 1. จุดที่ต้องแก้ไขข้อมูลส่วนตัว (ตั้งค่าตรงนี้)
// ==========================================
// ใส่ลิงก์ Model ที่ได้จากเว็บ Teachable Machine (อย่าลืมใส่ / ท้ายสุด)
const URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_LINK_HERE/"; 
    
// ใส่ชื่อ Class ที่เราตั้งไว้ว่าเป็นหน้าผู้ป่วย (เช่น "Patient", "Grandma") ให้ตรงกันเป๊ะๆ
const targetClassName = "Patient"; 

// ลิงก์ Webhook จากเว็บ Make.com สำหรับส่งเข้า LINE
const webhookURL = "https://hook.us1.make.com/YOUR_WEBHOOK_LINK_HERE";

// ==========================================
// ตัวแปรระบบเบื้องหลัง
let model, webcam, maxPredictions;
let isPatientFound = false; 
let hasAlerted = false; // ป้องกันการเตือนซ้ำรัวๆ

async function init() {
    // เปลี่ยนหน้าตาปุ่มและสถานะเมื่อกดเริ่ม
    document.getElementById("startBtn").style.display = "none";
    document.getElementById("status").innerText = "กำลังเปิดกล้องและโหลดสมองกล AI...";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // โหลดโมเดล AI
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // ตั้งค่ากล้อง (กว้าง 400x400)
    const flip = true; 
    webcam = new tmImage.Webcam(400, 400, flip); 
    await webcam.setup(); // ขอสิทธิ์เปิดกล้อง
    await webcam.play();
    
    window.requestAnimationFrame(loop);

    // นำภาพกล้องมาแสดงบนหน้าเว็บ
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    document.getElementById("status").innerText = "สแกนใบหน้าพร้อมทำงาน 🟢";

    // เริ่มจับเวลาเช็กคนหาย (15 นาที)
    setInterval(checkPatientStatus, 15 * 60 * 1000); 
}

async function loop() {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predictTopK(webcam.canvas, 1);
    const topResult = prediction[0];

    // ถ้า AI มั่นใจเกิน 85% ว่าเป็นหน้าผู้ป่วย (0.85)
    if (topResult.className === targetClassName && topResult.probability > 0.85) {
        if (!isPatientFound) {
            isPatientFound = true;
            
            // เปลี่ยนสีกล่องข้อความเป็นสีเขียว
            const statusBox = document.getElementById("status");
            statusBox.innerText = "✅ ยืนยันตัวตนสำเร็จ: ได้เวลาทานยาแล้วค่ะ";
            statusBox.style.backgroundColor = "#d4edda";
            statusBox.style.color = "#155724";
        }
    }
}

// ฟังก์ชันตรวจสอบว่าในเวลาที่กำหนด เจอผู้ป่วยไหม
function checkPatientStatus() {
    if (isPatientFound) {
        isPatientFound = false;
        document.getElementById("status").innerText = "สแกนใบหน้าพร้อมทำงาน 🟢";
        document.getElementById("status").style.backgroundColor = "#e0e0e0";
        document.getElementById("status").style.color = "#555";
    } else {
        sendLineAlert();
    }
}

// ฟังก์ชันยิงข้อความแจ้งเตือน (ส่งผ่าน Webhook ไปหา LINE)
function sendLineAlert() {
    const statusBox = document.getElementById("status");
    statusBox.innerText = "🚨 ตรวจพบความผิดปกติ: ไม่พบผู้ป่วย!";
    statusBox.style.backgroundColor = "#f8d7da";
    statusBox.style.color = "#721c24";

    fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: "ด่วน! ไม่พบผู้ป่วยในพื้นที่ในช่วงเวลารับยา กรุณากดลิงก์นี้เพื่อดูวิดีโอสด: [ใส่ลิงก์กล้องที่นี่]"
        })
    }).then(response => {
        console.log("ส่งแจ้งเตือนสำเร็จ!");
    }).catch(error => {
        console.error("ส่งแจ้งเตือนไม่สำเร็จ:", error);
    });
}

// ==========================================
// ฟังก์ชันสำหรับจัดการปุ่มกดบนแถบเมนู (Navbar)
// ==========================================
function showPage(pageName) {
    console.log("กำลังเปลี่ยนไปหน้า: " + pageName);
    // คุณสามารถเขียนโค้ดซ่อน/แสดงหน้ากระดาษตรงนี้เพิ่มได้ในอนาคต
}

function triggerManualPanic() {
    alert("🚨 แจ้งเตือนฉุกเฉินแบบกดเองทำงานแล้ว!");
    sendLineAlert(); // สั่งให้ส่งไลน์ทันทีเมื่อกดปุ่มฉุกเฉิน
}
