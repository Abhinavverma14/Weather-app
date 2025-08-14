const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let w, h;
let weatherEffect = "clear"; // default

function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Effect storage
let raindrops = [];
let snowflakes = [];
let clouds = [];

function initEffects() {
    raindrops = Array.from({ length: 80 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 4 + 4
    }));

    snowflakes = Array.from({ length: 50 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 3 + 2,
        speed: Math.random() * 1 + 0.5
    }));

    clouds = Array.from({ length: 5 }, () => ({
        x: Math.random() * w,
        y: Math.random() * (h / 2),
        width: Math.random() * 100 + 80,
        height: Math.random() * 40 + 30,
        speed: Math.random() * 0.5 + 0.2
    }));
}
initEffects();

function drawBackground() {
    ctx.clearRect(0, 0, w, h);

    if (weatherEffect === "sunny") {
        // Sky
        let grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "#87ceeb");
        grad.addColorStop(1, "#fceabb");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Sun
        ctx.beginPath();
        ctx.arc(w - 120, 120, 60, 0, Math.PI * 2);
        ctx.fillStyle = "#FFD700";
        ctx.fill();

    } else if (weatherEffect === "rainy") {
        ctx.fillStyle = "#6dd5ed";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#2193b0";
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "#a4def9";
        ctx.lineWidth = 1.5;
        raindrops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();

            drop.y += drop.speed;
            if (drop.y > h) drop.y = 0;
        });

    } else if (weatherEffect === "snowy") {
        ctx.fillStyle = "#e0eafc";
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "#fff";
        snowflakes.forEach(snow => {
            ctx.beginPath();
            ctx.arc(snow.x, snow.y, snow.radius, 0, Math.PI * 2);
            ctx.fill();

            snow.y += snow.speed;
            if (snow.y > h) snow.y = 0;
        });

    } else if (weatherEffect === "cloudy") {
        ctx.fillStyle = "#d7d2cc";
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "#f0f0f0";
        clouds.forEach(cloud => {
            ctx.beginPath();
            ctx.ellipse(cloud.x, cloud.y, cloud.width, cloud.height, 0, 0, Math.PI * 2);
            ctx.fill();

            cloud.x += cloud.speed;
            if (cloud.x > w + 100) cloud.x = -100;
        });

    } else {
        // Default clear sky
        ctx.fillStyle = "#74ebd5";
        ctx.fillRect(0, 0, w, h);
    }

    requestAnimationFrame(drawBackground);
}
drawBackground();

// Weather API fetching
document.getElementById('getWeatherBtn').addEventListener('click', function () {
    const location = document.getElementById('locationInput').value.trim();
    if (!location) {
        document.getElementById('weatherResult').innerHTML = '⚠️ Please enter a location.';
        return;
    }

    const apiKey = '604f678c063a4a21b60202115250404';
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('weatherResult').innerHTML = `❌ ${data.error.message}`;
                return;
            }

            const tempC = data.current.temp_c;
            const condition = data.current.condition.text;
            const icon = data.current.condition.icon;
            const windKph = data.current.wind_kph;
            const humidity = data.current.humidity;
            const aqi = data.current.air_quality["pm2_5"].toFixed(1);

            const emoji = getWeatherEmoji(condition);

            // Set effect based on condition
            setWeatherEffect(condition);

            document.getElementById('weatherResult').innerHTML = `
                <strong>${emoji} ${condition}</strong> <img src="${icon}" alt="Weather Icon"><br>
                🌡️ Temperature: ${tempC}°C<br>
                💨 Wind Speed: ${windKph} km/h<br>
                💧 Humidity: ${humidity}%<br>
                🏭 AQI (PM2.5): ${aqi}
            `;
        })
        .catch(error => {
            document.getElementById('weatherResult').innerHTML = '❌ Error fetching weather data.';
            console.error(error);
        });
});

function getWeatherEmoji(condition) {
    const c = condition.toLowerCase();
    if (c.includes("sunny")) return "☀️";
    if (c.includes("cloud")) return "☁️";
    if (c.includes("rain")) return "🌧️";
    if (c.includes("snow")) return "❄️";
    if (c.includes("storm") || c.includes("thunder")) return "⛈️";
    return "🌈";
}

function setWeatherEffect(condition) {
    const c = condition.toLowerCase();
    if (c.includes("sunny")) weatherEffect = "sunny";
    else if (c.includes("rain")) weatherEffect = "rainy";
    else if (c.includes("snow") || c.includes("ice") || c.includes("winter")) weatherEffect = "snowy";
    else if (c.includes("cloud")) weatherEffect = "cloudy";
    else weatherEffect = "clear";
}
