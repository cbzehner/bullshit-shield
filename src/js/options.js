/**
 * Set up and sync the state from the options page
 */
import browser from "webextension-polyfill"

/**
 * Initialize the options page on first load.
 */
const initializeOptions = async () => {
  await initializeCensorshipModes()
  await initializeCensorshipTerms()
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

const initializeCensorshipTerms = async () => {
  const { terms } = await browser.storage.sync.get("terms")
  if (terms.length > 0) {
    const fragment = createTermsList(terms)
    const termsList = document.querySelector("ul.censorship-terms-list")
    termsList.appendChild(fragment)
  }

  const addTermsForm = document.querySelector("form.add-term")
  addTermsForm.onsubmit = handleAddTerm
}

/**
 * Create a list of HTML elements for displaying and removing values from the
 * list of censored terms.
 */
const createTermsList = terms => {
  const createTermElement = term => {
    const termElem = document.createElement("li")
    termElem.textContent = term
    termElem.classList.add("censorship-term")

    return termElem
  }

  const createRemoveButton = () => {
    const removeButton = document.createElement("div")
    removeButton.innerHTML = "&times;"
    removeButton.onclick = handleRemoveTerm

    return removeButton
  }

  const fragment = document.createDocumentFragment()
  terms.forEach(term => {
    const termElem = createTermElement(term)
    const removeButton = createRemoveButton()
    const wrapper = document.createElement("div")
    wrapper.classList.add("wrapper")
    wrapper.appendChild(removeButton)
    wrapper.appendChild(termElem)
    fragment.appendChild(wrapper)
  })

  return fragment
}

/**
 * Store the selected censorship mode as the redaction class
 */
const handleSelectCensorshipMode = async radioInput =>
  browser.storage.sync.set({ redactionMode: radioInput.value })

/**
 * Add the selected term to the stored terms list
 */
const handleAddTerm = async event => {
  const termToAdd = event.target.firstElementChild.textContent.trim()
  const { terms } = await browser.storage.sync.get("terms")
  const newTerms = terms ? terms : []
  newTerms.push(termToAdd)
  await browser.storage.sync.set({ terms: newTerms })
}

/**
 * Remove the selected term from storage and then delete it from the DOM
 */
const handleRemoveTerm = async event => {
  const parentElem = event.target.parentElement
  const termToRemove = parentElem
    .querySelector("li.censorship-term")
    .textContent.trim()

  const { terms } = await browser.storage.sync.get("terms")
  const newTerms = terms.filter(term => term !== termToRemove)
  await browser.storage.sync.set({ terms: newTerms })

  return parentElem.remove() // Remove the parent and its children from the DOM
}

initializeOptions()
