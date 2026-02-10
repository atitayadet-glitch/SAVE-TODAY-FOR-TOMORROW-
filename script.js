let myChart;
let selectedEmoji = '🌱';
let points = parseInt(localStorage.getItem('garden_pts')) || 0;

const formatNum = (num) => Number(num).toLocaleString('en-US');
const cleanNum = (str) => str.toString().replace(/,/g, '');

// --- 1. การจัดการ Comma ---
function handleMoneyInput(el) {
    let val = cleanNum(el.value);
    if (isNaN(val)) val = '';
    el.value = (val !== '') ? formatNum(val) : '';
    updateUI();
}

function updateUI() {
    const goal = parseFloat(cleanNum(document.getElementById('goal-in').value)) || 0;
    const months = parseFloat(cleanNum(document.getElementById('month-in').value)) || 0;
    const resDisplay = document.getElementById('monthly-res');
    const adviceBox = document.getElementById('investment-advice');

    if (goal > 0 && months > 0) {
        const monthly = Math.ceil(goal / months);
        resDisplay.innerText = formatNum(monthly);
        updateAdvisor(months);
        updateChart(goal, monthly, months);
        adviceBox.classList.remove('hidden');
    } else {
        resDisplay.innerText = "0";
        adviceBox.classList.add('hidden');
    }
}

// --- 2. ระบบคำแนะนำการลงทุน ---

function updateAdvisor(months) {
    const text = document.getElementById('advice-text');
    if (months <= 12) text.innerText = "เน้นสภาพคล่อง! แนะนำบัญชีออมทรัพย์ Digital Savings หรือกองทุนตลาดเงิน ความเสี่ยงต่ำมาก";
    else if (months <= 36) text.innerText = "เน้นเติบโต! แนะนำกองทุนตราสารหนี้ หรือหุ้นกู้ชั้นดี เพื่อผลตอบแทนที่ชนะเงินเฟ้อ";
    else text.innerText = "เน้นระยะยาว! แนะนำ DCA ในกองทุนดัชนี (SET50/S&P500) เพื่อพลังดอกเบี้ยทบต้น";
}

// --- 3. ระบบกราฟ ---
function updateChart(goal, monthly, months) {
    const ctx = document.getElementById('savingsChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['ปัจจุบัน', 'กลางทาง', 'เป้าหมาย'],
            datasets: [{
                data: [0, goal/2, goal],
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                fill: true, tension: 0.3
            }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { display: false } } }
    });
}

// --- 4. บันทึกและรดน้ำ ---
function saveAndGrow() {
    const goal = document.getElementById('goal-in').value;
    const monthly = document.getElementById('monthly-res').innerText;
    if (cleanNum(goal) === "0" || goal === "") return alert("กรุณาระบุข้อมูล");

    points += 20;
    localStorage.setItem('garden_pts', points);
    let db = JSON.parse(localStorage.getItem('garden_db')) || [];
    db.push({ id: Date.now(), date: new Date().toLocaleDateString('th-TH'), goal, monthly });
    localStorage.setItem('garden_db', JSON.stringify(db));

    confetti({ particleCount: 150, spread: 60, colors: ['#2ecc71', '#f1c40f'] });
    updateTreeStage();
    alert("รดน้ำและบันทึกข้อมูลแล้ว!");
}

function updateTreeStage() {
    const lvl = Math.floor(points / 100) + 1;
    document.getElementById('growth-lvl').innerText = lvl;
    document.getElementById('growth-fill').style.width = (points % 100) + "%";
    const mainEmoji = document.getElementById('tree-stage');
    if (lvl === 1) mainEmoji.innerText = '🌱';
    else if (lvl === 2) mainEmoji.innerText = '🌿';
    else mainEmoji.innerText = selectedEmoji;
}

function selectTree(emoji, name) {
    selectedEmoji = emoji;
    document.getElementById('tree-name').innerText = "ต้น" + name;
    document.getElementById('tree-selector').classList.add('hidden');
    updateTreeStage();
}

// --- 5. ระบบ Admin & Export ---
function showLogin() { document.getElementById('login-modal').classList.remove('hidden'); }
function hideModals() { document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden')); }

function checkAuth() {
    if (document.getElementById('admin-pass').value === "1234") {
        hideModals();
        document.getElementById('admin-panel').classList.remove('hidden');
        renderAdmin();
    } else alert("รหัสผ่านไม่ถูกต้อง");
}

function renderAdmin() {
    const list = document.getElementById('admin-list');
    const statsText = document.getElementById('total-stats');
    const data = JSON.parse(localStorage.getItem('garden_db')) || [];

    let totalGoal = 0;
    data.forEach(item => totalGoal += parseFloat(cleanNum(item.goal)) || 0);

    statsText.innerHTML = `<b>📊 สรุปภาพรวม</b><br>รายการออม: ${data.length} | เป้าหมายรวม: ${formatNum(totalGoal)} บ.`;

    list.innerHTML = data.reverse().map(item => `
        <div class="history-item">
            <div><small>${item.date}</small><br>เป้า: ${item.goal} | ออม: ${item.monthly}</div>
            <button class="btn-delete" onclick="deleteEntry(${item.id})">🗑️ ลบ</button>
        </div>
    `).join('');
}

function deleteEntry(id) {
    let db = JSON.parse(localStorage.getItem('garden_db')).filter(i => i.id !== id);
    localStorage.setItem('garden_db', JSON.stringify(db));
    renderAdmin();
}

function copySummary() {
    const data = JSON.parse(localStorage.getItem('garden_db')) || [];
    let total = 0; data.forEach(i => total += parseFloat(cleanNum(i.goal)) || 0);
    const text = `📋 รายงานสรุปการออม\nจำนวน: ${data.length} รายการ\nเป้าหมายรวม: ${formatNum(total)} บาท`;
    navigator.clipboard.writeText(text).then(() => alert("คัดลอกสรุปแล้ว"));
}

function exportToCSV() {
    const data = JSON.parse(localStorage.getItem('garden_db')) || [];
    let csv = "\uFEFFวันที่,เป้าหมาย,ออมต่อเดือน\n";
    data.forEach(i => csv += `${i.date},${cleanNum(i.goal)},${cleanNum(i.monthly)}\n`);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Evergreen_Report.csv";
    link.click();
}

window.onload = updateTreeStage;
