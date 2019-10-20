/**
 * Provided centralized handling of message passing services. Essentially a primitive service worker.
 */
import terms from "./terms"

/**
 * Set default values when the extension is first installed
 */
const initializeBackground = () =>
  chrome.storage.sync.get("terms", initializeStorage)

/**
 * Set initial values for stored websites
 */
const initializeStorage = storageData => {
  if (storageData.terms) return // Terms have already been set

  chrome.storage.sync.set({ terms })
}

/**
 * Handle messages passed to background.js
 */
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  switch (request.message) {
    case "censoredTerms":
      // NOTE: may need to await the result here!
      return fetchCensoredTerms(request.url, sendResponse)
    // break
    // case "enable":
    //   protectRepo(request.url)
    //   break
    // case "disable":
    //   abandonRepo(request.url)
    //   break
  }

  return true
})

/**
 * Get the list of censored terms out of storage
 */
const fetchCensoredTerms = () => {
  const unpackTerms = storageData => {
    if (!storageData.terms) return []

    return storageData.terms
  }

  chrome.storage.sync.get("terms", unpackTerms)
}

chrome.runtime.onInstalled.addListener(initializeBackground)
