document.getElementById('getWeatherBtn').addEventListener('click', function() {
    const location = document.getElementById('locationInput').value;
    const apiKey = '604f678c063a4a21b60202115250404';
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tempC = data.current.temp_c;
            const condition = data.current.condition.text;
            const icon = data.current.condition.icon;

            const emoji = getWeatherEmoji(condition);
            document.getElementById('weatherResult').innerHTML = `
                ${emoji} ${condition} <br>
                Temperature: ${tempC}°C
                <img src="${icon}" alt="Weather Icon">
            `;
        })
        .catch(error => {
            document.getElementById('weatherResult').innerHTML = 'Error fetching weather data.';
        });
});

function getWeatherEmoji(condition) {
    if (condition.includes("Sunny")) return "☀️";
    if (condition.includes("Cloudy")) return "☁️";
    if (condition.includes("Rain")) return "🌧️";
    if (condition.includes("Snow")) return "❄️";
    return "🌈"; // Default emoji
}