/**
 * Common functions shared across the Content Script, Background Page or the
 * various UI pages used for managing extension state.
 */
import browser from "webextension-polyfill"

/**
 * Count the censored terms on a Page
 */
export const countTerms = async () => {
  const { redactionMode } = await browser.storage.sync.get("redactionMode")
  return document.querySelectorAll(`span.${redactionMode}`).length
}

/**
 * Get the Active Tab
 */
export const fetchActiveTab = async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  const activeTab = tabs[0]

  if (!activeTab) return null

  return activeTab
}
