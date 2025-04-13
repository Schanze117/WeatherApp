import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const {cityName} = req.body;
    if (!cityName) {
      return res.status(400).json({error: 'City name is required'});
    }
  // TODO: GET weather data from city name
  const weather = await WeatherService.getWeatherForCity(cityName);
  // TODO: save city to search history
  await HistoryService.addCity(cityName);
  return  res.json(weather);
}catch(error){ console.log(error);
    return res.status(500).json({error: 'Error saving city to search history'});
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    return res.json(cities);
  } catch (error) {
    return res.status(500).json({error: 'Error retrieving search history'});
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    await HistoryService.removeCity(id);
    return res.json({message: 'City removed from search history'});
  } catch (error) {
    return res.status(500).json({error: 'Error removing city from search history'});
  }
});

export default router;
