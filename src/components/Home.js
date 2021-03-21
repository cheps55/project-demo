import React, { Component } from "react";
import "../css/general.css";

import {Container} from 'react-bootstrap/';
import NavigationBar from "./NavigationBar";
import ProjectGalleryGrid from './ProjectGalleryGrid';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    projectSelected(clicked_project) {
        this.props.history.push({
            pathname: '/projectInfo' ,
                state: {
                    selected_project: clicked_project.currentTarget.dataset.id
                }
        });
    }

    render() {
        return (
            <div key="root">
                <Container key="body">
                    <NavigationBar />
                    <ProjectGalleryGrid functionCallFromParent={this.projectSelected.bind(this)} />
                </Container>
            </div>
        );
    }
}

export default Home