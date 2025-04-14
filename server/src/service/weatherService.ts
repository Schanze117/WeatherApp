import dotenv from 'dotenv';
dotenv.config();

  interface Coordinates {
    lat: number;
    lon: number;
  }
  class Weather {
    city: string;
    date: string;
    icon: string;
    iconDescription: string;
    tempF: number;
    humidity: number;
    windSpeed: number;
  
  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, humidity: number, windSpeed: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}
// This class defines the baseURL, API key, and city name properties
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }

  private async fetchLocationData(_query: string) {
      const response = await fetch(this.buildGeocodeQuery());
      const data = await response.json();
      return this.destructureLocationData(data[0]);
    }
  
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }
  
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }
 
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }
  private buildForecastQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }
 
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.cityName);
    return locationData;
  }
 
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const data = await response.json();
    return this.parseCurrentWeather(data);
  }
 
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.name,
      new Date(response.dt * 1000).toLocaleDateString(),
      response.weather[0].icon,
      response.weather[0].description,
      response.main.temp,
      response.main.humidity,
      response.wind.speed,
    );

  }
 
  private buildForecastArray(_currentWeather: Weather, weatherData: any[]): Weather[]{
    return weatherData.map(data => new Weather(
      this.cityName,
      data.dt_txt,
      data.main.temp,
      data.main.humidity,
      data.wind.speed,
      data.weather[0].icon,
      data.weather[0].description,
    ),
    // console.log(weatherData)
  );
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const response = await fetch(this.buildForecastQuery(coordinates));
    const data = await response.json();
    const chosenData = data.list.filter((weather: any) => { 
      return weather.dt_txt.includes("12:00:00")
    });
    const forecastArray = this.buildForecastArray(weatherData, chosenData);
    return [weatherData, ...forecastArray];
  }
}

export default new WeatherService();
