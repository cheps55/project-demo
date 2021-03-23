import React, { Component } from "react";

// connection with firebase
import firebase from "../config/config.js";
import "../css/general.css";

import {Container} from 'react-bootstrap/';
import NavigationBar from "./NavigationBar";
import StorageTable from "./StorageTable";
import Login from "./Login";

class Manage extends Component {
    constructor(props) {
        super(props);
        this.state = {
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

    validateLogin(isLogin) {
        this.setState({
            isLogined: isLogin
        }, () => {
            this.props.history.push({
                pathname: '/manage',
                state: this.state.isLogined
            })
        });
    }

    render() {
        return (
        <div key="root">
            <Container key="body">
                <NavigationBar />
                {
                    this.state.isLogined 
                    ?   <StorageTable />
                    :   <Login functionCallFromParent={this.validateLogin.bind(this)} />
                }
            </Container>
        </div>
        );
    }
}

export default Manage