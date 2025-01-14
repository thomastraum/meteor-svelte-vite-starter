import {
  formatDistanceToNow,
  intervalToDuration,
  formatDuration,
} from "date-fns";

import { tick } from "svelte";

export function formatDate(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatRuntime(runtime) {
  const duration = intervalToDuration({ start: 0, end: runtime });
  return formatDuration(duration, {
    format: ["hours", "minutes", "seconds", "milliseconds"],
    zero: false,
    delimiter: " ",
  });
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function debounce(func, wait) {
  let timeout;
  return async function executedFunction(...args) {
    clearTimeout(timeout);
    await tick();
    timeout = setTimeout(func, wait, ...args);
  };
}

export function getMax(inputKey, inputValue) {
  if (inputKey === "seed") {
    return 10000000000000000;
  } else if (inputValue <= 1.0) {
    return 1;
  } else {
    return 4096;
  }
}
