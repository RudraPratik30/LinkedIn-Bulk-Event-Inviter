chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "START_TICKER") {
    // Change periodInMinutes to 0.05 (roughly every 3 seconds)
    chrome.alarms.create("inviterTicker", { periodInMinutes: 0.05 });
    console.log("Ticker Started");
  } else if (request.action === "STOP_TICKER") {
    chrome.alarms.clear("inviterTicker");
    console.log("Ticker Stopped");
  }
});

// This fires even if the tab is in the background
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "inviterTicker") {
    chrome.tabs.query({ url: "https://www.linkedin.com/*" }, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { action: "DO_WORK" }).catch(() => {});
      });
    });
  }
});