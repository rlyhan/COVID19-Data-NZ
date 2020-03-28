import React, { Component } from 'react';
import { fetchConfirmedCases } from '../covid-data/scraper'

class App extends Component {

  constructor() {
    super()
    this.state = {
      currentPage: '',
      totalConfirmedCases: []
    }
  }

  componentDidMount() {
    fetchConfirmedCases()
      .then(data => {
        console.log(data)
        this.setState({ totalConfirmedCases: data })
      })
  }

  render() {
    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
