document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const city = document.getElementById('cityInput').value;
    const apiKey = document.getElementById('apiKeyInput').value;
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

    // Проверка на наличие API ключа
    if (!apiKey) {
        alert('Пожалуйста, введите ваш API ключ.');
        return;
    }

    // Получить широту и долготу по названию города
    fetch(`${proxyUrl}http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];

                // Получить данные о погоде по широте и долготе
                fetch(`${proxyUrl}https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(weatherData => {
                        const weatherResult = document.getElementById('weatherResult');
                        const weatherIcon = document.getElementById('weatherIcon');
                        const cityName = document.getElementById('cityName');
                        const temperature = document.getElementById('temperature');
                        const description = document.getElementById('description');
                        const humidity = document.getElementById('humidity');
                        const windSpeed = document.getElementById('windSpeed');

                        cityName.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
                        temperature.textContent = `Температура: ${weatherData.main.temp}°C`;
                        description.textContent = `Погода: ${weatherData.weather[0].description}`;
                        humidity.textContent = `Влажность: ${weatherData.main.humidity}%`;
                        windSpeed.textContent = `Скорость ветра: ${weatherData.wind.speed} м/с`;

                        const iconCode = weatherData.weather[0].icon;
                        weatherIcon.className = ''; // Сброс иконки
                        weatherIcon.classList.add('fas');
                        weatherIcon.classList.add(mapIconCodeToClass(iconCode));

                    })
                    .catch(error => console.error('Ошибка при получении данных о погоде:', error));
            } else {
                alert('Город не найден. Пожалуйста, попробуйте снова.');
            }
        })
        .catch(error => console.error('Ошибка при получении данных о местоположении:', error));
});

function mapIconCodeToClass(iconCode) {
    switch (iconCode) {
        case '01d':
            return 'fa-sun';
        case '01n':
            return 'fa-moon';
        case '02d':
        case '02n':
            return 'fa-cloud-sun';
        case '03d':
        case '03n':
        case '04d':
        case '04n':
            return 'fa-cloud';
        case '09d':
        case '09n':
            return 'fa-cloud-showers-heavy';
        case '10d':
        case '10n':
            return 'fa-cloud-rain';
        case '11d':
        case '11n':
            return 'fa-bolt';
        case '13d':
        case '13n':
            return 'fa-snowflake';
        case '50d':
        case '50n':
            return 'fa-smog';
        default:
            return 'fa-question';
    }
}
