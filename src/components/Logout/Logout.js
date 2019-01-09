import React, { Component } from 'react';
import Cookies from 'universal-cookie';


const cookies = new Cookies();

class Home extends Component {
  constructor(props) {
      super(props);
  }

  render() {
    cookies.remove("token");
    window.location.reload();
    return (
        <div className="container center">
            
        </div>
    );
  }
}

export default Home;
