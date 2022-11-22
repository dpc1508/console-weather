import colors from "colors";
import * as dotenv from "dotenv";

import {
  showMenuOpts,
  pause,
  readInput,
  listPlaces,
} from "./helpers/inquirer.js";
import Search from "./models/Searchs.js";
dotenv.config();

const main = async () => {
  console.clear();
  const search = new Search();
  let selectedOpt = "";
  do {
    selectedOpt = await showMenuOpts();

    switch (selectedOpt) {
      case "0":
        break;
      case "1":
        const query = await readInput("Place Name: ");
        const places = await search.city(query);

        const selectedPlaceId = await listPlaces(places);

        if (selectedPlaceId === "0") continue;

        const selectedPlace = places.find(
          (place) => place.id === selectedPlaceId
        );
        const { name, lat, lng } = selectedPlace;
        search.saveToHistory(name)
        const weatherInfo = await search.weatherByLatLng({ lat, lng });
        const { temp, min, max, desc } = weatherInfo;

        console.log("\n== Place Information == ".magenta);
        console.log("Name: ".cyan, name.magenta);
        console.log("Lat: ".cyan, `${lat}`.magenta);
        console.log("Lng: ".cyan, `${lng}`.magenta);
        console.log("Temperature: ".cyan, `${temp}`.magenta);
        console.log("Min: ".cyan, `${min}`.magenta);
        console.log("Max: ".cyan, `${max}`.magenta);
        console.log("Description: ".cyan, `${desc}`.magenta);

        break;

      case "2":
          search.formattedHistory.forEach((place, i) => {
            const idx = `${i+1}.`.green
            console.log(`${idx} ${place}`)
          })
        break;
    }

    if (selectedOpt !== "0") await pause();
  } while (selectedOpt !== "0");
};

main();
