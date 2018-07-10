const fileDivClassName = 'file'
const hideClass = 'ghf-hide'

let numFiltered = 0
let filteredDisplayContainerEl
let filteredDisplayEl

const setNumFilesText = () => {
  filteredDisplayEl.innerText = `${numFiltered} files filtered`
}

const hideFileDiff = e => {
  let parent = e
  while (parent && !parent.classList.contains(fileDivClassName)) {
    parent = parent.parentElement
  }

  if (parent) {
    parent.classList.add(hideClass)
  }
}

const filterFiles = ({ filter }) => {
  const elements = document.querySelectorAll('.file-info > a')
  const regex = new RegExp(filter)

  if (!filter) {
    return
  }

  Array.from(elements).forEach(e => {
    // const filename = e.text
    if (!regex.test(e.text)) {
      hideFileDiff(e)
      numFiltered = numFiltered + 1
    }
  })

  if (numFiltered > 0) {
    setNumFilesText()
    filteredDisplayContainerEl.classList.remove(hideClass)
  }
}

const clearFilters = () => {
  const elements = document.querySelectorAll(`.${hideClass}`)
  Array.from(elements).forEach(e => e.classList.remove(hideClass))
  numFiltered = 0
  filteredDisplayContainerEl.classList.add(hideClass)
}

// Listen for messages
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action === 'filter') {
    clearFilters()
    filterFiles(msg.data)
  }
  sendResponse()
})

const init = () => {
  filteredDisplayContainerEl = document.createElement('div')
  filteredDisplayContainerEl.classList.add('ghf__filtered_notification')
  filteredDisplayContainerEl.classList.add(hideClass)
  filteredDisplayEl = document.createElement('span')
  setNumFilesText()
  filteredDisplayContainerEl.appendChild(filteredDisplayEl)
  document.body.appendChild(filteredDisplayContainerEl)
}

init()
