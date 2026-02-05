// --- ระบบจัดการ Comma ---
document.querySelectorAll("input[inputmode='numeric']").forEach(input => {
    input.addEventListener("input", e => {
        let value = e.target.value.replace(/,/g, '').replace(/\D/g, '');
        e.target.value = value ? Number(value).toLocaleString() : '';
    });
});

function getVal(id) {
    return Number(document.getElementById(id).value.replace(/,/g, '')) || 0;
}

// --- ระบบ Gamification ---
let xp = 0;
function updateGame(saving, targetMonthly) {
    xp += 20;
    let level = Math.floor(xp / 100) + 1;
    let progress = Math.min((saving / targetMonthly) * 100, 100);

    document.getElementById("points").innerText = xp;
    document.getElementById("level").innerText = level;
    document.getElementById("progress").style.width = progress + "%";

    const icons = ["🌱", "🌿", "🌳", "💰", "👑"];
    const badges = ["นักออมมือใหม่", "นักออมขยัน", "เศรษฐีฝึกหัด", "เซียนการเงิน", "เทพเจ้าแห่งการออม"];

    let stage = Math.min(level - 1, 4);
    document.getElementById("level-icon").innerText = icons[stage];
    document.getElementById("badge").innerText = badges[stage];
}

// --- ระบบคำนวณ ---
function calculate() {
    let income = getVal("income");
    let expense = getVal("expense");
    let goal = getVal("goal");
    let goalType = document.getElementById("goalType").value;
    let risk = document.getElementById("risk").value;

    let monthlySaving = income - expense;

    if (monthlySaving <= 0) {
        alert("โอ๊ะโอ! รายจ่ายมากกว่ารายได้ ลองปรับลดค่าใช้จ่ายดูนะ");
        return;
    }

    // ปรับเป้าหมายให้เป็นรายเดือนเพื่อคำนวณ XP
    let targetMonthly = goalType === 'yearly' ? goal / 12 : goal;
    let monthsNeeded = Math.ceil(goal / (goalType === 'yearly' ? (monthlySaving * 12) / 12 : monthlySaving));

    // แสดงผล
    document.getElementById("result").style.display = "block";
    document.getElementById("saving-text").innerHTML = `✨ คุณมีเงินออมเหลือ <b>${monthlySaving.toLocaleString()}</b> บาท/เดือน`;

    if(goal > 0) {
        document.getElementById("months-text").innerHTML = `🎯 จะบรรลุเป้าหมายในอีก <b>${monthsNeeded.toLocaleString()}</b> เดือน`;
    }

    // อธิบายการลงทุน
    const info = {
        low: {
            title: "🔵 แผนเน้นปลอดภัย (Low Risk)",
            desc: `เหมาะสำหรับผู้ที่ไม่ชอบความเสี่ยง เงินต้นต้องอยู่ครบ!<br>
            • <b>เงินฝากดิจิทัล:</b> ดอกเบี้ยสูง ถอนง่าย<br>
            • <b>พันธบัตรรัฐบาล:</b> เราให้รัฐบาลกู้เงิน มั่นคงที่สุด<br>
            • <b>กองทุนตลาดเงิน:</b> เสี่ยงต่ำกว่าหุ้นมาก ผลตอบแทนดีกว่าออมทรัพย์`
        },
        medium: {
            title: "🟡 แผนสมดุล (Moderate Risk)",
            desc: `ยอมรับความผันผวนได้บ้าง เพื่อโอกาสได้ดอกเบี้ยที่สูงขึ้น<br>
            • <b>กองทุนรวมผสม:</b> มีทั้งหุ้นและตราสารหนี้ปนกัน<br>
            • <b>หุ้นกู้เอกชน:</b> ให้บริษัทใหญ่ยืมเงิน ได้ดอกเบี้ยสม่ำเสมอ<br>
            • <b>REITs:</b> ลงทุนในอสังหาฯ/ห้างสรรพสินค้า รับเงินปันผล`
        },
        high: {
            title: "🔴 แผนเน้นเติบโต (High Risk)",
            desc: `เน้นรวยเร็วในระยะยาว ต้องทนเห็นตัวเลขติดลบในบางวันได้<br>
            • <b>หุ้น/ETF:</b> เป็นเจ้าของธุรกิจระดับโลก มีโอกาสโตหลายเท่า<br>
            • <b>กองทุนต่างประเทศ:</b> ลงทุนใน Tech หรือ AI ที่กำลังมาแรง<br>
            • <b>สินทรัพย์ทางเลือก:</b> ทองคำ หรือ Crypto (แบ่งสัดส่วนน้อยๆ)`
        }
    };

    document.getElementById("investPlan").innerHTML = info[risk].title;
    document.getElementById("investDetail").innerHTML = info[risk].desc;

    updateGame(monthlySaving, targetMonthly);
}
