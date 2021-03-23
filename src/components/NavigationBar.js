import React, { Component } from "react";

// connection with firebase
import firebase from "../config/config.js";
import "../css/general.css";

import {Navbar, Nav} from 'react-bootstrap/';

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeImgSrc: "../img/home.png",
      settingImgSrc: "../img/setting.png",
      logoutImgSrc: "../img/logout.png", 
      isLogined: false
    }
  }

  componentDidMount() {
    this.checkLogin();
  }

  // check if the user is login or not
  checkLogin() {
      firebase.auth().onAuthStateChanged((user) => {
          if(user) {
              this.setState({
                  isLogined: true
              });
          } else {
              this.setState({
                  isLogined: false
              });
          }
      })
  }

  handleMouseOver(img) {
    switch(img.target.id) {
      case "home":
        this.setState({ homeImgSrc: "../img/home_hovered.png"});
        break;
      case "setting":
        this.setState({ settingImgSrc: "../img/setting_hovered.png"});
        break;
      case "logout":
        this.setState({ logoutImgSrc: "../img/logout_hovered.png"});
        break;
      default:
        break;
    }
  }

  handleMouseOut(img) {
    switch(img.target.id) {
      case "home":
        this.setState({ homeImgSrc: "../img/home.png"});
        break;
      case "setting":
        this.setState({ settingImgSrc: "../img/setting.png"});
        break;
      case "logout":
        this.setState({ logoutImgSrc: "../img/logout.png"});
        break;
      default:
        break;
    }
  }

  logout() {
    // confirm action
    if (!window.confirm("Confirm sign out?")) {
      return;
    }
    // log out from firebase
    firebase.auth().signOut();
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
              {
                this.state.isLogined &&
                <Navbar.Brand href="#" className="m-auto" onClick={this.logout.bind(this)}>
                  <img id="logout" width="50px" height="50px" alt="Logout" 
                    onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)} 
                    src={this.state.logoutImgSrc} 
                  />
                </Navbar.Brand>
              }
            </Nav>
        </Navbar>
    );
  }
}

export default NavigationBar