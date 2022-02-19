function rateProgram(id, rating) {
  const ratings = JSON.parse(localStorage.getItem("ratings") || "{}");

  ratings[id] = rating;

  localStorage.setItem("ratings", JSON.stringify(ratings));
}

function printStars(id) {
  const ratings = JSON.parse(localStorage.getItem("ratings") || "{}");

  if (ratings[id] === undefined) {
    return "program nije ocijenjen";
  }

  return "⭐".repeat(ratings[id]) + "☆".repeat(5 - ratings[id]);
}

export { rateProgram, printStars };
