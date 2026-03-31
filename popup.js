document.getElementById('start').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const count = parseInt(document.getElementById('targetCount').value);
  
  chrome.tabs.sendMessage(tab.id, { action: "START_INVITING", target: count });
  document.getElementById('currentCount').innerText = "0";
  document.getElementById('remainingCount').innerText = count;
});

document.getElementById('stop').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "STOP_INVITING" });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "UPDATE_STATS") {
    document.getElementById('currentCount').innerText = msg.current;
    document.getElementById('remainingCount').innerText = Math.max(0, msg.target - msg.current);
    document.getElementById('progressBar').style.width = `${(msg.current / msg.target) * 100}%`;
  }
});