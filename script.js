/***** 🔥 Firebase Config (ใส่ของคุณเอง) *****/
const firebaseConfig = {
apiKey: "ใส่ของคุณ",
authDomain: "ใส่ของคุณ",
projectId: "ใส่ของคุณ"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/***** 🎮 Gamification *****/
let point = 0;

/***** 🔢 ใส่คอมม่าให้ตัวเลข *****/
function formatNumber(num){
return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/***** 💰 คำนวณ + บันทึกข้อมูลจริง *****/
function calculate(){
let income = Number(document.getElementById("income").value);
let goal = Number(document.getElementById("goal").value);

if(income <= 0 || goal <= 0){
alert("กรุณากรอกข้อมูลให้ถูกต้อง");
return;
}

let monthlySave = income * 0.2;
let months = Math.ceil(goal / monthlySave);

// 🎮 เพิ่มคะแนน
point += 10;
document.getElementById("point").innerText = point;

// 🔥 บันทึกลง Firebase (ข้อมูลรวมทุกคน)
db.collection("users").add({
income: income,
goal: goal,
monthlySave: monthlySave,
months: months,
createdAt: new Date()
});

document.getElementById("result").innerHTML =
`💡 แนะนำให้ออมเดือนละ <b>${formatNumber(monthlySave)}</b> บาท<br>
⏳ จะถึงเป้าหมายใน <b>${formatNumber(months)}</b> เดือน<br>
📈 แนวทางลงทุน: เงินฝาก 40% / กองทุนรวม 40% / หุ้น 20%`;
}