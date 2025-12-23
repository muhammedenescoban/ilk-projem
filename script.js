let glasses = 0;
const totalGoal = 10;
let userData = {
    bmi: "--",
    calories: "--",
    water: 0
};

function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
        section.style.opacity = "0";
    });
    
    const selectedPage = document.getElementById('page-' + pageId);
    if (selectedPage) {
        selectedPage.classList.remove('hidden');
        setTimeout(() => {
            selectedPage.style.opacity = "1";
            selectedPage.style.transition = "opacity 0.4s ease";
        }, 50);
    }
}

function updateDashboard() {
    const dashBmi = document.getElementById('dash-bmi-val');
    const dashCal = document.getElementById('dash-cal-val');
    const dashWater = document.getElementById('dash-water-val');

    if (dashBmi) dashBmi.innerText = userData.bmi;
    if (dashCal) dashCal.innerText = userData.calories !== "--" ? userData.calories + " kcal" : "--";
    if (dashWater) dashWater.innerText = glasses + " / " + totalGoal;
}

function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmi_weight').value);
    const height = parseFloat(document.getElementById('bmi_height').value) / 100;
    const resultDiv = document.getElementById('bmi-result');

    if (weight > 0 && height > 0) {
        const bmi = (weight / (height * height)).toFixed(1);
        userData.bmi = bmi;
        
        let category = "";
        let color = "#38bdf8";

        if (bmi < 18.5) { category = "Zayıf"; color = "#fbbf24"; }
        else if (bmi < 24.9) { category = "Normal"; color = "#10b981"; }
        else if (bmi < 29.9) { category = "Fazla Kilolu"; color = "#f59e0b"; }
        else { category = "Obezite"; color = "#ef4444"; }

        resultDiv.innerHTML = `VKI: <strong>${bmi}</strong> - <span style="color:${color}">${category}</span>`;
        updateDashboard();
    } else {
        alert("Lütfen geçerli boy ve kilo girin!");
    }
}

function calculateCalories() {
    const age = parseInt(document.getElementById('cal_age').value);
    const gender = document.getElementById('cal_gender').value;
    const weight = parseFloat(document.getElementById('cal_weight').value);
    const height = parseFloat(document.getElementById('cal_height').value);
    const activity = parseFloat(document.getElementById('cal_activity').value);
    const resultDiv = document.getElementById('cal-result');

    if (age > 0 && weight > 0 && height > 0) {
        let bmr = gender === 'male' 
            ? (10 * weight + 6.25 * height - 5 * age + 5) 
            : (10 * weight + 6.25 * height - 5 * age - 161);

        const tdee = Math.round(bmr * activity);
        userData.calories = tdee;
        
        resultDiv.style.display = "block";
        resultDiv.innerHTML = `Günlük İhtiyaç: <strong>${tdee} kcal</strong>`;
        updateDashboard();
    } else {
        alert("Lütfen tüm alanları doldurun.");
    }
}

function addGlass() {
    if (glasses < totalGoal) {
        glasses++;
        updateWaterUI();
    }
}

function resetWater() {
    glasses = 0;
    updateWaterUI();
}

function updateWaterUI() {
    const glassCount = document.getElementById('glassCount');
    const waterFill = document.getElementById('waterFill');
    if (glassCount) glassCount.innerText = glasses;
    if (waterFill) waterFill.style.height = (glasses / totalGoal * 100) + "%";
    
    updateDashboard();
    if (glasses === totalGoal) alert("Günlük su hedefine ulaştınız! 💧");
}

const fatGenderSelect = document.getElementById('fat_gender');
if (fatGenderSelect) {
    fatGenderSelect.addEventListener('change', function() {
        const hipGroup = document.getElementById('fat-hip-group');
        if (hipGroup) hipGroup.style.display = this.value === 'female' ? 'block' : 'none';
    });
}

function calculateFat() {
    const gender = document.getElementById('fat_gender').value;
    const height = parseFloat(document.getElementById('fat_height').value);
    const waist = parseFloat(document.getElementById('fat_waist').value);
    const neck = parseFloat(document.getElementById('fat_neck').value);
    const hip = parseFloat(document.getElementById('fat_hip').value);

    if (!height || !waist || !neck) { alert("Eksik veri!"); return; }

    let fat;
    if (gender === 'male') {
        fat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
        if (!hip) { alert("Kalça ölçüsü girin!"); return; }
        fat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450;
    }

    const resArea = document.getElementById('fat-result-area');
    const fatPct = document.getElementById('fat-percentage');
    if (resArea) resArea.style.display = 'block';
    if (fatPct) fatPct.innerText = "%" + fat.toFixed(1);
}

function toggleModal(type = 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
    if (modal.style.display === 'flex') switchAuth(type);
}

function switchAuth(type) {
    const title = document.getElementById('authTitle');
    const registerOnly = document.getElementById('register-only');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (type === 'login') {
        title.innerText = "Tekrar Hoşgeldin!";
        registerOnly.classList.add('hidden');
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        title.innerText = "Aramıza Katıl!";
        registerOnly.classList.remove('hidden');
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
    }
}

document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const isRegister = !document.getElementById('register-only').classList.contains('hidden');
    const name = isRegister ? this.querySelector('input[type="text"]').value : "Kullanıcı";
    
    loginSuccess(name);
    toggleModal();
});

function loginSuccess(name) {
    document.getElementById('nav-login-btn').classList.add('hidden');
    document.getElementById('nav-register-btn').classList.add('hidden');
    document.getElementById('user-profile').classList.remove('hidden');
    document.getElementById('user-name-display').innerText = "Merhaba, " + name;
    
    document.querySelectorAll('.nav-dashboard').forEach(el => el.classList.remove('hidden'));
    showPage('dashboard');
    updateDashboard();
}

function logout() {
    location.reload();
}

window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) toggleModal();
}

function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
        section.style.opacity = "0";
    });
    
    if (pageId === 'home') {
        const hero = document.getElementById('page-home');
        const content = document.getElementById('home-content');
        hero.classList.remove('hidden');
        content.classList.remove('hidden');
        setTimeout(() => {
            hero.style.opacity = "1";
            content.style.opacity = "1";
        }, 50);
    } else {
        const selectedPage = document.getElementById('page-' + pageId);
        if (selectedPage) {
            selectedPage.classList.remove('hidden');
            setTimeout(() => {
                selectedPage.style.opacity = "1";
            }, 50);
        }
    }
}
