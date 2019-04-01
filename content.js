const root = document.body;
const walker = document.createTreeWalker(
  root,
  NodeFilter.SHOW_ELEMENT,
  null,
  false
);

// https://stackoverflow.com/questions/15553280/replace-a-textnode-with-html-text-in-javascript
// https://devdocs.io/dom/childnode/replacewith
const terms = new Set(["Chrome", "extension"]);
const redactionClass = "blurred"; // blurred invisible-ink redacted

while (walker.nextNode()) {
  const current = walker.currentNode;
  const isCandidateNode =
    current.childElementCount === 0 || current.tagName === "P";
  if (current.textContent.includes("JavaScript")) {
    console.log(current);
    debugger;
  }

  if (isCandidateNode && current.textContent) {
    terms.forEach(term => {
      if (current.textContent.includes(term)) {
        if (current.textContent.includes("JavaScript")) {
          console.log(current);
          debugger;
        }
        const contents = current.innerHTML.split(term);
        current.innerHTML = contents.join(
          `<span class="${redactionClass}">${term}</span>`
        );
      }
    });
    walker.nextNode();
  }
}
