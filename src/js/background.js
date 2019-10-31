/**
 * Provided centralized handling of message passing services. Essentially a primitive service worker.
 */
import browser from "webextension-polyfill"
import defaultTerms from "./terms"
import { fetchActiveTab } from "./utils"

/**
 * Set default values when the extension is first installed
 */
const initializeStorage = async () => {
  const { terms } = await browser.storage.sync.get("terms")
  if (terms) return // Terms have already been set

  // TODO: Make this user configurable
  const redaction = "blurred" // Options: blurred invisible-ink redacted

  return browser.storage.sync.set({ terms: defaultTerms, redaction })
}

/**
 * Handle messages passed to background script
 */
const handleMessages = async (request, sender, _) => {
  switch (request.message) {
    case "enable":
      return enableExtension()
    case "disable":
      return disableExtension()
    case "updateBadge":
      if (request.active) {
        setBadgeCount({ tabId: sender.tab.id, count: request.count })
      }
      return setBadgeColor({ tabId: sender.tab.id, active: request.active })
  }

  return true
}

/**
 * Enable the browser extension when clicked
 */
const enableExtension = async () => {
  const activeTab = await fetchActiveTab()
  browser.tabs.sendMessage(activeTab.id, { message: "censor" })
}

/**
 * Disable the browser extension when clicked
 */
const disableExtension = async () => {
  const activeTab = await fetchActiveTab()
  browser.tabs.sendMessage(activeTab.id, { message: "uncensor" })
}

/**
 * Get the count of censored terms for the active tab
 */
const countCensoredTerms = async () => {
  const activeTab = await fetchActiveTab()
  const result = await browser.tabs.sendMessage(activeTab.id, {
    message: "getCountFromTab",
  })
  const { count } = result
  console.log(`current count is ${count}`)
  return Promise.resolve({ count })
}

/**
 * Set the count of terms displayed on the browser action
 */
const setBadgeCount = ({ tabId, count }) =>
  browser.browserAction.setBadgeText({ text: `${count}`, tabId })

/**
 * Set the background color of the count displayed on the browser action
 */
const setBadgeColor = ({ tabId, active }) => {
  const color = active ? "#0084d0" : "#bd5757"
  browser.browserAction.setBadgeBackgroundColor({ color, tabId })
}

browser.runtime.onInstalled.addListener(initializeStorage) // Only run at initial installation
browser.runtime.onMessage.addListener(handleMessages) // Handle message passing
