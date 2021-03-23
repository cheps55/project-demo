import React, { Component } from "react";
import "../css/general.css";
// connection with firebase
import firebase from "../config/config.js";

import {Container, Form, Button} from 'react-bootstrap/';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    componentDidMount() {

    }

    validateLogin(event) {
        event.preventDefault();
        console.log(this.state.username + " : " + this.state.password);
        firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
        .then(res => {
            if (res.user) {
                this.props.functionCallFromParent(true);
            }
        })
        .catch(e => {
            // Invalid login
            this.setState({
                username: '',
                password: ''
            });
            alert("Invalid username / password");
            this.props.functionCallFromParent(false);
        });
        
    }

    /* Input change*/
    handleUsernameChange(target) {
        this.setState({username: target.target.value});
    }
    handlePasswordChange(target) {
        this.setState({password: target.target.value});
    }

    render() {
        return (
            <Container key="login" id="login">
                <Form onSubmit={this.validateLogin.bind(this)}>
                    <Form.Group controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control 
                            type="email" placeholder="Enter username" 
                            onChange={this.handleUsernameChange.bind(this)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" placeholder="Password" 
                            onChange={this.handlePasswordChange.bind(this)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            </Container>
        );
    }
}

export default Login