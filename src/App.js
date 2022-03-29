import React from 'react';
import './App.css';
import Header from './Header';
import Weather from './Weather';
import Footer from './Footer';
import axios from 'axios';
import Movies from './Movies';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      locationObj: {},
      map: '',
      err: '',
      weatherData: [],
      city: '',
      moviesResult: null
    }

  }

  getLocation = async () => {
    try {

      const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${this.state.searchQuery}&format=json`

      const response = await axios.get(url);

      console.log(response);
      this.setState({ err: '' });
      this.setState({ locationObj: response.data[0] });
      this.setState({ map: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&center=${this.state.locationObj.lat},${this.state.locationObj.lon}&zoom=12` });
    }
    catch (error) {
      this.setState({ err: error.message });
      this.setState({ locationObj: '' });
    }
    this.getForecast();
  }
  getForecast = async () => {
    try {
      const url = `${process.env.REACT_APP_SERVER}/weather`
      const weatherResponse = await axios.get(url, { params: { searchQuery: this.state.searchQuery, lat: this.state.locationObj.lat, lon: this.state.locationObj.lon } });
      this.setState({ weatherData: weatherResponse.data });

    } catch (error) {
      this.setState({ displayError: true })
    }
  }
  getMovies = async () => {
    try {
      const url = `${process.env.REACT_APP_SERVER}movies?query=${this.state.city}`
      const moviesResult = await axios.get(url);
      this.setState({ moviesResult: moviesResult.data });
    } catch (error) {
      this.setState({ displayError: true })
    }
  }

  render() {
    // console.log(this.state.weatherData);
    return (
      <>
        <div className='App'>
          <Header />
          <input onChange={(event) => this.setState({ searchQuery: event.target.value })} placeholder='city'></input>
          <button onClick={this.getLocation}> Explore!</button>

          {this.state.locationObj.display_name &&
            <>
              <h2> The city you searched for was: {this.state.locationObj.display_name}</h2>
              <h3> latitude: {this.state.locationObj.lat}</h3>
              <h3> longitude: {this.state.locationObj.lat}</h3>
              <img src={this.state.map} alt={this.state.locationObj.display_name} title={this.state.locationObj.display_name} />
              {this.state.weatherData &&

                <>
                <Weather forecastData={this.state.weatherData} />
                <Movies forecastData={this.state.moviesResult} /></>
              }
            </>
          }
          {this.state.err &&
            <>
              <h3> ERROR: {this.state.err}</h3>
            </>
          }
        </div >
        <Footer />
      </>
    );
  }
}

export default App;
