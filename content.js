let isRunning = false;
let selectedIds = new Set();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function startInviting(targetCount) {
  if (isRunning) return;
  isRunning = true;
  selectedIds.clear();

  const container = document.querySelector('.artdeco-modal__content') || 
                    document.querySelector('.invite-themed-extensions-social-step__form-container');

  if (!container) {
    alert("Please open the Invite Modal first!");
    isRunning = false;
    return;
  }

  while (isRunning && selectedIds.size < targetCount) {
    // 1. Find visible connections
    let checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]:not(:checked)'))
      .filter(cb => {
        const aria = (cb.getAttribute('aria-label') || "").toLowerCase();
        return !aria.includes('select all');
      });

    // 2. Faster Scroll if no boxes found
    if (checkboxes.length === 0) {
      container.scrollTop += 600;
      await sleep(800); // Wait just enough for lazy load
      continue;
    }

    for (const box of checkboxes) {
      if (!isRunning || selectedIds.size >= targetCount) break;

      const row = box.closest('li') || box.parentElement;
      const personId = row?.innerText.substring(0, 40) || box.id;

      if (selectedIds.has(personId)) continue;

      // Snappier Behavior:
      box.scrollIntoView({ behavior: 'auto', block: 'center' });
      
      // Reduced delay to 300ms - 600ms
      await sleep(Math.floor(Math.random() * 300) + 300); 

      box.click();
      
      // Quick verify
      await sleep(150);
      if (box.checked || box.getAttribute('aria-checked') === "true") {
        selectedIds.add(personId);
        chrome.runtime.sendMessage({ 
          action: "UPDATE_STATS", 
          current: selectedIds.size, 
          target: targetCount 
        }).catch(() => {});
      }
    }
    
    // Nudge down and move to next batch quickly
    container.scrollTop += 300;
    await sleep(400);
  }

  isRunning = false;
  alert(`Finished! Selected ${selectedIds.size} connections.`);
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "START_INVITING") startInviting(request.target);
  if (request.action === "STOP_INVITING") isRunning = false;
});