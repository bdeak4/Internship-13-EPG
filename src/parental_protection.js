function hasPin() {
  return localStorage.getItem("pin") !== null;
}

function isCorrectPin(pin) {
  return hasPin() && localStorage.getItem("pin") === pin;
}

function isValidPin(pin) {
  if (pin.length < 4 || pin.length > 8) {
    return false;
  }
  return /^\d+$/.test(pin);
}

function setPin(pin) {
  if (isValidPin) {
    localStorage.setItem("pin", pin);
  }
}

function pinPrompt(message) {
  const error = "pin mora imati 4 do 8 znakova i sadržavati samo brojeve";

  let pin = prompt(message);
  while (pin !== null && !isValidPin(pin)) {
    pin = prompt(message + "\n\n" + error);
  }

  return pin;
}

function pinPromptWithAuth(message) {
  let pin = pinPrompt(message);
  while (pin !== null && !isCorrectPin(pin)) {
    pin = pinPrompt(message + "\n\npin nije točan");
  }
  return pin;
}

export { hasPin, setPin, pinPrompt, pinPromptWithAuth };
