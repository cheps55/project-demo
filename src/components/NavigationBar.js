import React, { Component } from "react";
import "../css/general.css";

import {Navbar, Nav} from 'react-bootstrap/';

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeImgSrc: "../img/home.png"
    }
  }

  handleMouseOver() {
    this.setState({
      homeImgSrc: "../img/home_hovered.png"
    });
  }

  handleMouseOut() {
    this.setState({
      homeImgSrc: "../img/home.png"
    });
  }

  render() {
    return (
        <Navbar sticky="top" key="navbar">
            <Nav className="m-auto">
              <Navbar.Brand href="/" className="m-auto">
                <img width="50px" height="50px" alt="Home" 
                  onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)} 
                  src={this.state.homeImgSrc}
                />
              </Navbar.Brand>
            </Nav>
        </Navbar>
    );
  }
}

export default NavigationBar