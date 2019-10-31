/**
 * The content script injected into each page.
 * Handles messages passed to individual tabs.
 */
import browser from "webextension-polyfill"
import { censorDocument, uncensorDocument } from "./censor"

/**
 * Handle messages passed to content script
 */
const handleMessages = async (request, _sender, _) => {
  switch (request.message) {
    case "censor":
      return censorDocument()
    case "uncensor":
      return uncensorDocument()
  }

  return true
}

/**
 * Add runtime listeners to the content script. These respond to messages passed
 * from the background script.
 */
browser.runtime.onMessage.addListener(handleMessages)

censorDocument() // Censor page on initial load
