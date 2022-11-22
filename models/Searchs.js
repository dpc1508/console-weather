import axios from "axios";
import fs from "fs";

class Search {
  history = [];
  dbPath = "./db/data.json";

  constructor() {
    this.readHistoryFromJSON();
  }

  get formattedHistory(){
    return this.history.map( i => {
        const temp = i.split(' ')
        const words = temp.map(i => (i[0].toLocaleUpperCase() + i.substring(1)))
        return words.join(' ')
    })
  }

  get paramsMapBox() {
    return {
      language: "en,es",
      access_token: process.env.MAPBOX_TOKEN,
      limit: 5,
    };
  }

  get paramsWeather() {
    return {
      units: "metric",
      appid: process.env.OPENWEATHER_TOKEN,
    };
  }

  async city(place = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapBox,
      });

      const res = await instance.get();

      return res.data.features.map((feature) => ({
        id: feature.id,
        name: feature.place_name,
        lng: feature.center[0],
        lat: feature.center[1],
      }));
    } catch (err) {
      return [];
    }
  }

  async weatherByLatLng({ lat, lng: lon }) {
    try {
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: {
          ...this.paramsWeather,
          lat,
          lon,
        },
      });

      const res = await instance.get();
      const { main, weather } = res.data;

      return {
        temp: main?.temp || "-",
        min: main?.temp_min || "-",
        max: main?.temp_max || "-",
        desc: weather[0]?.description || "-",
      };
    } catch (err) {
      return {
        temp: "-",
        min: "-",
        max: "-",
        desc: "-",
      };
    }
  }

  saveToHistory(place = "") {
    if (this.history.includes(place.toLocaleLowerCase())) return;
    this.history = this.history.splice(0, 4)
    this.history.unshift(place.toLocaleLowerCase());
    this.saveHistoryToJSON();
  }

  saveHistoryToJSON() {
    const payload = {
      history: this.history,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readHistoryFromJSON() {
    try {
      if (!fs.existsSync(this.dbPath)) return;

      const data = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
      const tempHistory = JSON.parse(data);

      if (tempHistory.history) this.history = tempHistory.history;

    } catch (err) {
      console.log(err);
    }
  }
}

export default Search;
