// chromeUtils.js

/* global chrome */

export const getChrome = () => {
  if (typeof window !== "undefined" && typeof chrome !== "undefined") {
    return chrome;
  }
  return null;
};
