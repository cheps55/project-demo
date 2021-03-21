import React, { Component } from "react";
import "../css/general.css";

import {Navbar, Nav} from 'react-bootstrap/';

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeImgSrc: "../img/home.png",
      settingImgSrc: "../img/setting.png"
    }
  }

  handleMouseOver(img) {
    switch(img.target.id) {
      case "home":
        this.setState({
          homeImgSrc: "../img/home_hovered.png"
        });
        break;
      case "setting":
        this.setState({
          settingImgSrc: "../img/setting_hovered.png"
        });
        break;
      default:
        break;
    }
  }

  handleMouseOut(img) {
    switch(img.target.id) {
      case "home":
        this.setState({
          homeImgSrc: "../img/home.png"
        });
        break;
      case "setting":
        this.setState({
          settingImgSrc: "../img/setting.png"
        });
        break;
      default:
        break;
    }
  }

  render() {
    return (
        <Navbar sticky="top" key="navbar">
            <Nav className="m-auto">
              <Navbar.Brand href="/" className="m-auto">
                <img id="home" width="50px" height="50px" alt="Home" 
                  onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)} 
                  src={this.state.homeImgSrc}
                />
              </Navbar.Brand>
              <Navbar.Brand href="/manage" className="m-auto">
                <img id="setting" width="50px" height="50px" alt="Setting" 
                  onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)} 
                  src={this.state.settingImgSrc}
                />
              </Navbar.Brand>
            </Nav>
        </Navbar>
    );
  }
}

export default NavigationBar