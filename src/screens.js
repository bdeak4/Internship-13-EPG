import { getSchedule } from "./schedule.js";
import { formatProgram, convertTimeToMs } from "./utility.js";

function chooseTimeScreen(error) {
  const customTime = prompt(`Dobro došli u TV vodič
Upišite vrijeme ako dolazite iz budučnosti ili ostavite prazno za trenutno vrijeme.
Hint: "2022-02-19 13:00"

${error ? error : ""}`);

  if (customTime !== "") {
    const newTime = new Date(customTime);

    if (!isNaN(newTime.getTime())) {
      window.time = newTime;
    } else {
      return chooseTimeScreen("Datum nije valjan");
    }
  }

  return scheduleScreen();
}

function scheduleScreen() {
  const formatPrograms = (programs) => {
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
f\t\tpregledaj favorite
r 22\t\tocijeni program 22
`);

  if (command === null) {
    alert("Izlaz iz programa");
    return;
  }

  const moveTime = command.match(/(\+|-)(\d+)(m|h|d)/);
  if (moveTime !== null) {
    const [, operator, timeAmount, timeFormat] = moveTime;

    let timeDifference = convertTimeToMs(parseInt(timeAmount), timeFormat);

    if (operator === "-") {
      timeDifference *= -1;
    }

    window.time.setTime(window.time.getTime() + timeDifference);
    return scheduleScreen();
  }
}

export { chooseTimeScreen };
