const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const cors = require('cors');

const app = express();
app.use(cors()); // อนุญาตให้หน้าเว็บ (index.html) ส่งข้อมูลข้ามมาหาเซิร์ฟเวอร์นี้ได้
app.use(express.json());

// ==========================================
// ตั้งค่า Discord Bot (เอาโค้ดลับมาจาก Discord Developer Portal)
// ==========================================
const DISCORD_BOT_TOKEN = "MTUxNDQ5NDkyMTE5MTU4Nzg2MA.GxFqEG.OofgbjFQAh9jsvKHfOUL2y4oD3udZ5lbBWell8";
const DISCORD_CHANNEL_ID = "1514494386132619306";

// สร้างตัวบอท
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`🤖 Discord Bot ออนไลน์แล้วในชื่อ: ${client.user.tag}`);
});

// เปิดประตูหลังบ้าน (API Endpoint) รอรับแรงกดปุ่มจากหน้าเว็บ
app.post('/api/help', async (req, res) => {
    try {
        // ไปดึงช่องแชทใน Discord มา
        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        
        if (channel) {
            // สั่งให้บอทพิมพ์ข้อความลงในช่องแชทนั้น
            await channel.send("🚨 **[แจ้งเตือนด่วน]** มีคนกดปุ่มขอความช่วยเหลือ (Help) จากหน้าต่างระบบ AI Monitor! กรุณาตรวจสอบด่วน");
            
            // ตอบกลับหน้าเว็บว่า "ส่งข้อความสำเร็จแล้วนะ!"
            res.status(200).json({ success: true, message: "แจ้งเตือนเข้า Discord สำเร็จ!" });
        } else {
            res.status(404).json({ success: false, message: "ไม่พบช่องแชท Discord นี้" });
        }
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// สั่งให้บอทเข้าระบบ
client.login(DISCORD_BOT_TOKEN);

// เปิดเซิร์ฟเวอร์หลังบ้านที่พอร์ต 3000
app.listen(3000, () => {
    console.log("🌐 เซิร์ฟเวอร์หลังบ้านรันอยู่ที่ http://localhost:3000");
});
