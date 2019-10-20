/**
 * Add the appropriate message passing to the toggle in popup.html
 */
import browser from "webextension-polyfill"

/**
 * Main method for popup.js
 */
const initializePopup = () => {
  const checkbox = document.querySelector('input[type="checkbox"]')
  checkbox.onclick = async () => await handleClick(checkbox)
}

/**
 * Calculate what message to send based on the current state of the checkbox element
 */
const handleClick = async checkbox => {
  let message
  if (checkbox.checked) {
    message = "enable"
  } else {
    message = "disable"
  }

  // Pass the message along with the active tab to the message sending callback
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })

  return sendClickMessage(message, tabs[0])
}

/**
 * Pass a message to the background page enabling or disabling the extension
 */
const sendClickMessage = async (message, tab) => {
  return browser.runtime.sendMessage({ message, tabId: tab.id })
}

initializePopup()
