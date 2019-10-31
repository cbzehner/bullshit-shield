/**
 * Add the appropriate message passing to the toggle in popup.html
 */
import browser from "webextension-polyfill"

/**
 * Main method for popup.js
 */
const initializePopup = async () => {
  const checkbox = document.querySelector('input[type="checkbox"]')

  const { active } = await browser.storage.sync.get("active")
  checkbox.checked = active ? true : false

  checkbox.onclick = async () => await handleClick(checkbox)
}

/**
 * Send a message to the background page disabling or enabling the extension
 * based on the current state of the checkbox element's checked property.
 */
const handleClick = async checkbox => {
  const message = checkbox.checked ? "enable" : "disable"
  return browser.runtime.sendMessage({ message })
}

initializePopup()
