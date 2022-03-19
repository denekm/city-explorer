import React from 'react';
import './App.css';
import axios from 'axios';
import bootstrap from 'bootstrap';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      searchQuery:'',
      locationObj: {},
      map:''
    }

  }
  getLocation = async() => {
    const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${this.state.searchQuery}&format=json`
    const response = await axios.get(url);
    console.log(response);
    this.setState({locationObj: response.data[0]});
    this.setState({map:`https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&center=${this.state.locationObj.lat},${this.state.locationObj.lon}&zoom=12`})
  }
  render() {
    return (
      <div className='App'>
        <input onChange={(event) => this.setState({searchQuery: event.target.value})} placeholder= 'type a city'></input>
   < button onClick ={this.getLocation}> Explore!</button>

   {this.state.locationObj.display_name && 
   <>
   <h3> The city you searched for was: {this.state.locationObj.display_name}</h3>
   <h3> latitude: {this.state.locationObj.lat}</h3>
   <h3> longitude: {this.state.locationObj.lat}</h3>
   <img src={this.state.map} alt={this.state.locationObj.display_name} title={this.state.locationObj.display_name}/>
   </>


   }
   </div >
    );
  }
}

export default App;
