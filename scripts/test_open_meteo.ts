// script to test Open Meteo connection
const lat = 35.6895;
const lon = 139.6917;
const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FTokyo`;

console.log(`Fetching from: ${url}`);

fetch(url)
    .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    })
    .then(data => {
        console.log('✅ Open Meteo Connection Successful!');
        console.log('Data received:', JSON.stringify(data.current, null, 2));
    })
    .catch(err => {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    });
