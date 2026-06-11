// ==========================================
// ฟังก์ชันสำหรับสลับหน้าต่าง (Window Switcher)
// ==========================================
function showPage(pageName, buttonElement) {
    // 1. ซ่อนทุกหน้าต่าง โดยการเอาคลาส 'active' ออกจากทุกหน้าที่มีคลาส 'page-section'
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => page.classList.remove('active'));

    // 2. ดึงหน้าต่างที่เราต้องการเปิด แล้วเติมคลาส 'active' เข้าไปเพื่อให้มันแสดงตัว
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // 3. เปลี่ยนสีไฮไลท์ที่ปุ่มบน Navbar
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active')); // เอาไฮไลท์สีขาวออกจากทุกปุ่มก่อน
    
    if (buttonElement) {
        buttonElement.classList.add('active'); // เติมไฮไลท์สีขาวให้ปุ่มล่าสุดที่เพิ่งกดไป
    }
}

function triggerManualPanic() {
    alert("🚨 แจ้งเตือนฉุกเฉินแบบกดเองทำงานแล้ว!");
    sendLineAlert(); 
}
