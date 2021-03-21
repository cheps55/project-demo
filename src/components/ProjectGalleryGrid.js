import React, { Component } from "react";
// connection with firebase
import firebase from "../config/config.js";
import "../css/general.css";

import {Container, Card, Row, Col} from 'react-bootstrap/';

class ProjectGalleryGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project_list : []
    }
  }

  componentDidMount() {
    this.getProject();
  }

  getProject() 
  {
    const project_ref = firebase.firestore().collection("project");
    project_ref.onSnapshot((snapshot) => {
      if(!snapshot.empty) {
        snapshot.forEach(
          doc => {
            if(doc.data().visible) {
              var storage_ref = firebase.storage().ref(doc.data().id);
              storage_ref.child("cover.jpg").getDownloadURL().then(url => {
                const projects = this.state.project_list;
                projects.push({
                  id: doc.data().id,
                  title: doc.data().title,
                  description: doc.data().description,
                  coverImgUrl: url
                });
                this.setState({ project_list: projects }); 
              });
            }
          }
        );
      }
    })      
  }

  projectSelected(clicked_project) {
    clicked_project.preventDefault();
    this.props.functionCallFromParent(clicked_project);
  }

  // Form the project gallery grid
  formGrid() {
    const itemPerRow = 2;
    const projects = this.state.project_list.map((project, index) => {
      return (
        <Col key={"col" + index}>
          <Card as="a" onClick={this.projectSelected.bind(this)} key={project.id} data-id={project.id} className="m-auto" >
            <Card.Img src={project.coverImgUrl} alt="Image not loaded" />
            <Card.Body>
              <Card.Title>{project.title}</Card.Title>
              <Card.Text>{project.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      );
    })
    let rows = [], cols = [];
    let row = 0;
    for (let index = 0; index < projects.length; index++) {
      cols.push(projects[index])
      if((index + 1) === projects.length) {
        rows.push(<Row key={"row" + row}>{cols}</Row>);
        cols = [];
        row++;
      } else if ((index + 1) % itemPerRow === 0) {
        rows.push(<Row key={"row" + row}>{cols}</Row>);
        cols = [];
        row++;
      }
    }
    return rows;
  }

  render() {
    return (
        <Container key="project_grid" className="project_grid"> { this.formGrid() }</Container>
    );
  }
}

export default ProjectGalleryGrid