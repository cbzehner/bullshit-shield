/**
 * Set up and sync the state from the options page
 */
import browser from "webextension-polyfill"

/**
 * Initialize the options page on first load.
 */
const initializeOptions = async () => {
  await initializeCensorshipModes()
  // const { terms } = await browser.storage.sync.get("terms")

  // checkbox.onclick = async () => await handleClick(checkbox)
}

const initializeCensorshipModes = async () => {
  const { redactionMode } = await browser.storage.sync.get("redactionMode")
  const censorshipModes = document.querySelectorAll('input[type="radio"]')

  censorshipModes.forEach(mode => {
    if (mode.value === redactionMode) {
      mode.checked = true
    }
    mode.onclick = async () => await handleSelectCensorshipMode(mode)
  })
}

const handleSelectCensorshipMode = async radioInput =>
  browser.storage.sync.set({ redactionMode: radioInput.value })

initializeOptions()
