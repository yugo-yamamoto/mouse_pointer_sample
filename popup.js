const btnCursor  = document.getElementById('toggleCursor');
const btnSparkle = document.getElementById('toggleSparkle');

chrome.storage.local.get({ cursorEnabled: true, sparkleEnabled: true }, (state) => {
  render(btnCursor,  state.cursorEnabled);
  render(btnSparkle, state.sparkleEnabled);
});

btnCursor.addEventListener('click', () => {
  chrome.storage.local.get({ cursorEnabled: true }, ({ cursorEnabled }) => {
    const next = !cursorEnabled;
    chrome.storage.local.set({ cursorEnabled: next });
    render(btnCursor, next);
  });
});

btnSparkle.addEventListener('click', () => {
  chrome.storage.local.get({ sparkleEnabled: true }, ({ sparkleEnabled }) => {
    const next = !sparkleEnabled;
    chrome.storage.local.set({ sparkleEnabled: next });
    render(btnSparkle, next);
  });
});

function render(btn, enabled) {
  btn.className = 'toggle ' + (enabled ? 'on' : 'off');
}
