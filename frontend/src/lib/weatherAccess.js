"use client";

export async function getCuacaJogja (lat, long) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,weather_code&timezone=Asia/Jakarta`
    );
    const data = await response.json();

    const weatherCode = data.current.weather_code;
    const cuaca = getWeatherDescription(weatherCode);

    return {
      suhu: data.current.temperature_2m,
      cuaca: cuaca
    };
  } catch (error) {
    console.error('Error:', error);
  }
}

// Fungsi konversi kode cuaca ke deskripsi
function getWeatherDescription (code) {
  const weatherMap = {
    0: 'Cerah',
    1: 'Sebagian Berawan',
    2: 'Berawan',
    3: 'Mendung',
    45: 'Berkabut',
    61: 'Hujan Ringan',
    63: 'Hujan Sedang',
    65: 'Hujan Lebat'
  };
  return weatherMap[code] || 'Tidak Diketahui';
}