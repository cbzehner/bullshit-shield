/**
 * Provided centralized handling of message passing services. Essentially a primitive service worker.
 */
import browser from "webextension-polyfill"
import defaultTerms from "./terms"

/**
 * Set default values when the extension is first installed
 */
const initializeBackground = async () => {
  return initializeStorage()
}

/**
 * Set initial values for stored websites
 */
const initializeStorage = async () => {
  const { terms } = await browser.storage.sync.get("terms")
  if (terms) return // Terms have already been set

  // TODO: Make this user configurable
  const redaction = "blurred" // Options: blurred invisible-ink redacted

  return browser.storage.sync.set({ terms: defaultTerms, redaction })
}

/**
 * Handle messages passed to background.js
 */
const handleMessages = async (request, _sender, _sendResponse) => {
  switch (request.message) {
    case "enable":
      // TODO: Re-run the script when activating the extension
      enableExtension(request.tabId)
      break
    case "disable":
      // TODO: Undo the extension actions when activating
      disableExtension(request.tabId)
      break
  }

  return true
}

/**
 * Enable the browser Extension when clicked
 */
const enableExtension = tabId => {
  console.log("Adding Bullshit Shield. TODO: Fill me in!")

  // browser.tabs.executeScript({ file: "censor.js" })

  // browser.browserAction.enable(tabId, addShield)
}

/**
 * Disable the browser Extension when clicked
 */
const disableExtension = tabId => {
  console.log("Removing Bullshit Shield. TODO: Fill me in!")

  // browser.browserAction.disable(tabId, removeShield)
}

/**
 * Run the countTerms content script on the active tab and update the icon count
 */
const updateTermsCount = async activeInfo => {
  const { tabId } = activeInfo

  try {
    const { count } = await browser.tabs.sendMessage(tabId, "countTerms")
    await browser.browserAction.setBadgeText({ text: `${count}`, tabId: tabId })
  } catch (error) {
    console.warn(`Bullshit Shield: ${error.message}`)
    return false
  }

  return true
}

browser.runtime.onInstalled.addListener(initializeBackground) // Installing extension
browser.tabs.onActivated.addListener(updateTermsCount) // Switching tabs
browser.runtime.onMessage.addListener(handleMessages) // Handle message passing
