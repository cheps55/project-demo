import React, { Component } from "react";
// connection with firebase
import firebase from "../config/config.js";
import "../css/general.css";

import {Container, Carousel} from 'react-bootstrap/';
import NavigationBar from "./NavigationBar";

class ProjectInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display_list: []
        }
        try {
            this.selected_project = this.props.location.state.selected_project;
        } catch (Exception) { }
    }

    componentDidMount() {
        this.getProjectRes();
    }

    // format file name to display as caption
    formatFileName(fileName) {
        var name = fileName.split('.')[0];
        if(name.includes('_')) { name = name.split('_')[1]; }
        var formatedName = "";
        for(let i = 0; i < name.length; i++) {
            if(i === 0) {
                formatedName = name.charAt(i).toUpperCase();
            } else {
                if(name.charAt(i) === name.charAt(i).toUpperCase()) {
                    formatedName += " " + name.charAt(i).toUpperCase();
                } else {
                    formatedName += name.charAt(i);
                }
            }
        }
        return formatedName;
    }

    // Get image or video of the selected project
    getProjectRes() 
    {
        var storageRef = firebase.storage().ref(this.selected_project);
        storageRef.listAll().then(res => {
            res.items.forEach(item => {
                // Set file type
                let file_type = "image";
                if(item.name.includes("mp4")) { file_type = "video"; }
                // Download file
                item.getDownloadURL().then(url => {
                    const current_display_list = this.state.display_list;
                    if(item.name !== "cover.jpg") 
                    {
                        current_display_list.push({
                            name: item.name,
                            file_type: file_type,
                            url: url
                        });
                        this.setState({display_list: current_display_list})
                    }
                });
            });    
        });
    }

    // Reset Video when slide is changed
    ResetVideo() {
        var video = document.querySelector("video");
        if(video !== null) {
            video.pause();
            video.currentTime = 0;
        }
    }

  render() {
    return (
        <Container key="body">
            <NavigationBar />
            <Carousel key="carousel" className="m-auto" onSelect={this.ResetVideo.bind(this)}> 
                {
                    this.state.display_list
                        .sort((item1, item2) => item1.name > item2.name ? 1 : -1)
                        .map(item => {
                            if(item.file_type === "video") {
                                return (
                                    <Carousel.Item key={item.name}> 
                                        <video controls muted>
                                            <source src={item.url} type="video/mp4" />
                                        </video>
                                        <Carousel.Caption>
                                            {this.formatFileName(item.name)}
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                )
                            } else {
                                return (
                                    <Carousel.Item key={item.name}>  
                                        <img src={item.url} alt={item.name} />
                                        <Carousel.Caption>
                                            {this.formatFileName(item.name)}
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                )
                            }
                        })
                }
            </Carousel>
        </Container>
    );
  }
}

export default ProjectInfo