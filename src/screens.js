import {
  addProgramToFavourites,
  listFavouritePrograms,
  removeProgramFromFavourites,
} from "./favourites.js";
import {
  hasPin,
  pinPrompt,
  pinPromptWithAuth,
  setPin,
} from "./parental_protection.js";
import { printStars, rateProgram } from "./rating.js";
import { getProgramById, getSchedule } from "./schedule.js";
import { formatProgram, convertTimeToMs } from "./utility.js";

function chooseTimeScreen(error) {
  const customTime = prompt(`Dobro došli u TV vodič
Upišite vrijeme ako dolazite iz budućnosti ili ostavite prazno za trenutno vrijeme.
Hint: "2022-02-19 13:00"

${error ? error : ""}`);

  if (customTime === null) {
    alert("Izlaz iz programa");
    return;
  }

  if (customTime !== "") {
    const newTime = new Date(customTime);

    if (!isNaN(newTime.getTime())) {
      window.time = newTime;
    } else {
      return chooseTimeScreen("Datum nije valjan");
    }
  }

  if (!hasPin()) {
    const pin = pinPrompt("molimo postavite pin za roditeljsku zaštitu");
    if (pin !== null) {
      setPin(pin);
    }
  }

  return scheduleScreen();
}

function scheduleScreen(error) {
  const formatPrograms = (programs) => {
    if (programs[0] === null && programs[1] === null && programs[2] === null) {
      return "prekid programa";
    }

    return programs.map((p, i) => formatProgram(p, i === 1)).join("\n");
  };

  const formatChannel = (channel) => {
    return `${channel.name}
${formatPrograms(channel.programs)}`;
  };

  const schedule = getSchedule(window.time)
    .map((c) => formatChannel(c))
    .join("\n\n");

  const command = prompt(`Programi u vrijeme: ${window.time.toLocaleString()}
* - aktivni programi

${schedule}

+60m\tprikaži raspored pomaknut za 60 min u buducnost
-60m\tprikaži raspored pomaknut za 60 min u proslost
\t\t(radi i za sate (h) i dane (d))
o 22\t\tpogledaj opis programa 22
f 22\t\tdodaj program 22 u favorite
rf 22\tizbrisi program 22 iz favorita
f\t\tpregledaj favorite
r 22\t\tocijeni program 22
pp\t\tpromjeni roditeljski pin

${error ? error : ""}`);

  if (command === null) {
    alert("Izlaz iz programa");
    return;
  }

  const moveTimeMatch = command.match(/^(\+|-)(\d+)(m|h|d)$/);
  if (moveTimeMatch !== null) {
    const [, operator, timeAmount, timeFormat] = moveTimeMatch;

    let timeDifference = convertTimeToMs(parseInt(timeAmount), timeFormat);

    if (operator === "-") {
      timeDifference *= -1;
    }

    window.time.setTime(window.time.getTime() + timeDifference);
    return scheduleScreen();
  }

  const programDescriptionMatch = command.match(/^o[^\d]*(\d+)$/);
  if (programDescriptionMatch !== null) {
    const [, id] = programDescriptionMatch;
    return programDescriptionScreen(parseInt(id));
  }

  const addProgramToFavouritesMatch = command.match(/^f[^\d]*(\d+)$/);
  if (addProgramToFavouritesMatch !== null) {
    const [, id] = addProgramToFavouritesMatch;
    return addProgramToFavouritesScreen(parseInt(id));
  }

  const removeProgramFromFavouritesMatch = command.match(/^rf[^\d]*(\d+)$/);
  if (removeProgramFromFavouritesMatch !== null) {
    const [, id] = removeProgramFromFavouritesMatch;
    return removeProgramFromFavouritesScreen(parseInt(id));
  }

  if (command === "f") {
    return listFavouriteProgramsScreen();
  }

  const rateProgramMatch = command.match(/^r[^\d]*(\d+)$/);
  if (rateProgramMatch !== null) {
    const [, id] = rateProgramMatch;
    return rateProgramScreen(parseInt(id));
  }

  if (command === "pp") {
    return changePinScreen();
  }

  return scheduleScreen(`naredba "${command}" ne postoji`);
}

function programDescriptionScreen(id) {
  const program = getProgramById(id);

  if (program === null) {
    alert("program ne postoji");
    return scheduleScreen();
  }

  if (program.category === "odrasli program") {
    const pin = pinPromptWithAuth("molimo upišite pin za roditeljsku zaštitu");

    if (pin === null) {
      return scheduleScreen();
    }
  }

  alert(`${formatProgram(program, false)}

${printStars(program.id)}

${program.description || "program nema opis"}
`);
  return scheduleScreen();
}

function addProgramToFavouritesScreen(id) {
  if (getProgramById(id) === null) {
    alert("program ne postoji");
    return scheduleScreen();
  }

  addProgramToFavourites(id);

  alert("program uspješno dodan u favorite");

  return scheduleScreen();
}

function removeProgramFromFavouritesScreen(id) {
  if (getProgramById(id) === null) {
    alert("program ne postoji");
    return scheduleScreen();
  }

  removeProgramFromFavourites(id);

  alert("program uspješno izbrisan iz favorita");

  return scheduleScreen();
}

function listFavouriteProgramsScreen() {
  const favourites = listFavouritePrograms()
    .map((p) => formatProgram(p, p.start < window.time))
    .join("\n");
  alert(`Favoriti

${favourites.length ? favourites : "nema favorita"}`);

  return scheduleScreen();
}

function rateProgramScreen(id) {
  const program = getProgramById(id);

  if (program === null) {
    alert("program ne postoji");
    return scheduleScreen();
  }

  if (program.category === "odrasli program") {
    const pin = pinPromptWithAuth("molimo upišite pin za roditeljsku zaštitu");

    if (pin === null) {
      return scheduleScreen();
    }
  }

  const message = "ocijeni program (1-5)";
  const error = "ocjena mora biti između 1 i 5";

  let rating = parseInt(prompt(message));
  while (rating < 1 || rating > 5 || isNaN(rating)) {
    rating = parseInt(prompt(message + "\n\n" + error));
  }

  rateProgram(id, rating);

  alert("Program uspješno ocijenjen");

  return scheduleScreen();
}

function changePinScreen() {
  const pin = pinPromptWithAuth(
    "molimo upišite postojeći pin za roditeljsku zaštitu"
  );

  if (pin === null) {
    return scheduleScreen();
  }

  const newPin = pinPrompt("molimo upišite novi pin za roditeljsku zaštitu");

  if (newPin !== null) {
    setPin(newPin);
  }

  return scheduleScreen();
}

export { chooseTimeScreen };
