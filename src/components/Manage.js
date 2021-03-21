import React, { Component } from "react";
import "../css/general.css";

import {Container} from 'react-bootstrap/';
import NavigationBar from "./NavigationBar";
import StorageTable from "./StorageTable";

class Manage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
        <div key="root">
            <Container key="body">
                <NavigationBar />
                <StorageTable />
            </Container>
        </div>
        );
    }
}

export default Manage