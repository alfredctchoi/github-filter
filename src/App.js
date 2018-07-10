import React, { Component } from 'react'
import './App.css'

const handleOnTabRemove = tabId => {
  window.chrome.storage.local.remove(tabId.toString())
}

class App extends Component {
  constructor(props) {
    super(props)
    this.form = null
    this.onChange = this.onChange.bind(this)

    this.state = {
      filter: ''
    }
  }

  componentDidMount() {
    window.chrome.tabs.onRemoved.addListener(handleOnTabRemove)
    window.chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tabId = tabs[0].id
      window.chrome.tabs.insertCSS(tabId, {
        file: 'styles.css'
      })
      window.chrome.storage.local.get(tabId.toString(), result => {
        if (!result[tabId]) {
          return
        }

        const { filter } = result[tabId]
        this.setState({
          filter
        })
      })
    })
    this.form.filter.focus()
  }

  componentWillUnmount() {
    window.chrome.tabs.onRemoved.removeListener(handleOnTabRemove)
  }

  onChange(e) {
    e.preventDefault()
    const { filter: filterEl } = this.form
    const { value: filter } = filterEl

    this.setState({ filter })
    window.chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tabId = tabs[0].id
      window.chrome.storage.local.set({
        [tabId]: { filter }
      })
      window.chrome.tabs.sendMessage(tabId, {
        action: 'filter',
        data: { filter }
      })
    })
  }

  render() {
    const { filter } = this.state
    return (
      <div className="app">
        <h4 className="app__title">GitHub File Filter</h4>
        <hr />
        <form
          ref={f => {
            this.form = f
          }}
          className="app__form"
          autocomplete="off"
          role="presentation">
          <div className="form-group">
            <label htmlFor="filter">Filter Regex</label>
            <input
              value={filter}
              onChange={this.onChange}
              className="form-control"
              id="filter"
              type="text"
              name="filter"
              placeholder="^((?!spec).)*$"
            />
          </div>
        </form>
      </div>
    )
  }
}

export default App
