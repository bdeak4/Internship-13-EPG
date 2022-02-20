import { getProgramById } from "./schedule.js";

function addProgramToFavourites(id) {
  const favourites = JSON.parse(localStorage.getItem("favourites") || "[]");

  favourites.push(id);

  localStorage.setItem("favourites", JSON.stringify([...new Set(favourites)]));
}

function removeProgramFromFavourites(id) {
  let favourites = JSON.parse(localStorage.getItem("favourites") || "[]");

  favourites = favourites.filter((fId) => fId !== id);

  localStorage.setItem("favourites", JSON.stringify([...new Set(favourites)]));
}

function listFavouritePrograms() {
  const favouriteIds = JSON.parse(localStorage.getItem("favourites") || "[]");

  const favourites = favouriteIds.map((id) => getProgramById(id));

  return favourites.filter((f) => f.end > window.time);
}

export {
  addProgramToFavourites,
  removeProgramFromFavourites,
  listFavouritePrograms,
};
