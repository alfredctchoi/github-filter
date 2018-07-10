'use strict'

chrome.runtime.onInstalled.addListener(function() {
  // limit the scope of the application to github.com
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: 'github.com',
              pathSuffix: 'files'
            }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ])
  })

  window.chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.includes('github.com') && changeInfo.url === undefined) {
      window.chrome.storage.local.remove(tabId.toString())
    }
  })
})
