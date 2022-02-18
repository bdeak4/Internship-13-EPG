function formatString(string, maxLength) {
  if (string.length > maxLength) {
    return string.slice(0, maxLength - 3) + "...";
  }
  return string;
}

function formatTime(time) {
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatProgram(program, selected) {
  const selection = selected ? "*" : "";

  if (program === null) {
    return `prekid programa ${selection}`;
  }

  const time = `(${formatTime(program.start)}-${formatTime(program.end)})`;
  const title = formatString(program.title, 35);
  const rerun = program.rerun ? "(R)" : "";

  return `${time}\t${program.id}\t${title} ${rerun} ${selection}`;
}

function convertTimeToMs(amount, format) {
  switch (format) {
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "m":
      return amount * 60 * 1000;
  }
  return 0;
}

export { formatString, formatTime, formatProgram, convertTimeToMs };
