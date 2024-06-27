export const getLogger = (prefix: string): Pick<Console, "log" | "error" | "warn" | "debug"> => ({
  debug: (...message) => console.debug(prefix, ...message),
  log: (...message) => console.log(prefix, ...message),
  warn: (...message) => console.warn(prefix, ...message),
  error: (...message) => console.error(prefix, ...message),
});
