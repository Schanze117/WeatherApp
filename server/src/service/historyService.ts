import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
//City class with name and id properties
class City {
  name: string;
  id: string;

  constructor( name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
class HistoryService {
  //Defines a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }
  // This is a method that writes the updated cities array to the searchHistory.json file
    private async write(cities: City[]) {
    return await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'));
  }
  // This is a method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      let citiesArray: City[];
      try {
        citiesArray = [].concat(JSON.parse(cities));
      } catch (error) {
        citiesArray = [];
      }
      return citiesArray;
    });
  }
  //The addCity method adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city) {
      throw new Error('City name is required');
    }

  const newCity: City = {name: city, id:uuidv4()};

  return await this.getCities()
      .then((cities) => {
        if (cities.find((index) => index.name === city)) {
          return cities;
        }
        return [...cities, newCity]
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => newCity);
  }
  // This is a method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities) => this.write(filteredCities));
  }
}

export default new HistoryService();
