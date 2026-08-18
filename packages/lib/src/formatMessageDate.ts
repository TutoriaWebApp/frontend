export const formatMessageDate = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return timeStr;
  }

  const dateStr = date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${dateStr} ${timeStr}`;
};
