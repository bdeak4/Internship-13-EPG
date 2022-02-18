import { channels, programs } from "./data.js";

function getSchedule(datetime) {
  return channels.map((c) => {
    return {
      name: c.name,
      programs: [
        getProgram(c.id, datetime, -1),
        getProgram(c.id, datetime, 0),
        getProgram(c.id, datetime, +1),
      ],
    };
  });
}

function getProgram(channelId, datetime, offset) {
  const sortedChannelPrograms = programs
    .filter((p) => p.channelId === channelId)
    .sort((a, b) => a.start > b.start);

  const selectedProgramIndex = sortedChannelPrograms.findIndex(
    (p) => p.start < datetime && p.end > datetime
  );
  const programIndex = selectedProgramIndex + offset;

  if (
    selectedProgramIndex === -1 ||
    programIndex < 0 ||
    programIndex >= sortedChannelPrograms.length
  ) {
    return null;
  }

  return sortedChannelPrograms[programIndex];
}

export { getSchedule, getProgram };
