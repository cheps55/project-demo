import React, { Component } from "react";
// connection with firebase
import firebase from "../config/config.js";
import "../css/general.css";

import {Container, Table, Button, Form} from 'react-bootstrap/';

class StorageTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list : [],
            display_directory: true,
            display_info: false,
            display_file: false
        }
    }      

    componentDidMount() {
        this.getStorage();
    }

    // Get storage directory and list all
    getStorage() 
    {
        var storageRef = firebase.storage().ref();
        storageRef.listAll().then(res => {
            res.prefixes.forEach(prefix => {
                const directory_list = this.state.list;
                directory_list.push({
                    id: "directory_" + prefix.name,
                    name: prefix.name,
                    checked: false
                });
                this.setState({
                    list: directory_list,
                    display_directory: true,
                    display_info: false,
                    display_file: false
                });
            });    
        });
    }
    // Get directory info stored in firestore
    getDirectoryInfo(directory_name) 
    {
        this.setState({
            list: []
        });
        const info_list = [];
        const info_ref = firebase.firestore().collection("project").where("id", "==", directory_name);
        info_ref.onSnapshot(snapshot => {
            snapshot.forEach(doc => {
                info_list.push({
                    id: directory_name,
                    title: doc.data().title,
                    checked: doc.data().visible,
                    description: doc.data().description
                });
                this.setState({
                    list: info_list,
                    display_directory: false,
                    display_info: true,
                    display_file: false
                });
            });
        });
    }
    // Get all file in selected directory and list all
    getStorageFile(target) 
    {
        this.setState({
            list: []
        });
        var storageRef = firebase.storage().ref(target.target.id);
        storageRef.listAll().then(res => {
            res.items.forEach(item => {
                // Set file type
                let file_type = "image";
                if(item.name.includes("mp4")) { file_type = "video"; }
                // Download file
                item.getDownloadURL().then(url => {
                    const file_list = this.state.list;
                    if(item.name !== "cover.jpg") 
                    {
                        file_list.push({
                            id: target.target.id + "/" + item.name,
                            name: item.name,
                            file_type: file_type,
                            url: url,
                            checked: false
                        });
                        this.setState({
                            list: file_list,
                            display_directory: false,
                            display_info: false,
                            display_file: true
                        });
                    }
                });
            });    
        });
    }

    // View Directory info of selected directory
    viewDirectory(selected_directory) 
    {
        if(selected_directory.target != null) 
        {
            this.getDirectoryInfo(selected_directory.target.id);
        }
    }

    // Reset the page to default state
    refreshPage() 
    {
        this.setState({
            list: [],
            display_directory: true,
            display_info: false,
            display_file: false
        });
        this.getStorage();
    }

    // Checkbox control
    selectAll(checkbox) {
        if(checkbox.target != null && checkbox.target.value === "All") {
            if(checkbox.target.checked) {
                this.state.list.forEach(item => {
                    item.checked = true;
                });
            } else {
                this.state.list.forEach(item => {
                    item.checked = false;
                });
            }
            this.setState({
                list: this.state.list
            });
        }
    }
    setChecked(checkboxId) {
        var checkbox = this.state.list.filter(item => item.id === checkboxId);
        checkbox[0].checked = true;
        this.setState({
            list: this.state.list
        });
    }
    setUnChecked(checkboxId) {
        var checkbox = this.state.list.filter(item => item.id === checkboxId);
        checkbox[0].checked = false;
        this.setState({
            list: this.state.list
        });
    }
    checkboxOnChange(checkbox) {
        if(checkbox.target != null) {
            if(checkbox.target.checked) {
                this.setChecked(checkbox.target.id);
            } else {
                this.setUnChecked(checkbox.target.id);
            }
        }
    }
    
    // TextArea control
    textareaOnChange(textarea) {
        if(textarea.target != null) {
            var directory = this.state.list[0];
            var slot = textarea.target.id.split("_");
            var column = slot[slot.length - 1];
            if(column === "title") {
                directory.title = textarea.target.value;
            } else {
                directory.description = textarea.target.value;
            }
            this.setState({
                list: this.state.list
            });
        }
    }

    // Storage Control
    updateInfo() {
        var directory_name = this.state.list[0].id;
        const info_ref = firebase.firestore().collection("project").where("id", "==", directory_name).limit(1).get();
        info_ref.then(data => {
            if(data.docs[0].id.length > 0) {
                firebase.firestore().collection("project").doc(data.docs[0].id).update({
                    title: this.state.list[0].title,
                    visible: this.state.list[0].checked,
                    description: this.state.list[0].description
                }).then(() => {
                    alert("Info Updated");
                });
            }
        });
    }
    deleteItem() {
        var selected = this.state.list.filter(x => x.checked);
        var notSelected = this.state.list.filter(x => !x.checked);
        if(selected.length > 0) {
            selected.forEach(item => {
                firebase.storage().ref(item.id).delete();
            });
            alert("All File Deleted");
        }
        // Update current list to newest
        this.setState({
            list: notSelected
        });
    }

    render() {
        return (
            <Container key="storage_list" className="storage_list"> 
                <Container key="storage_control" id="storage_control">
                    {
                        (this.state.display_file) &&
                        <Button variant="danger" onClick={this.deleteItem.bind(this)}>Delete</Button>
                    }
                    {
                        this.state.display_info &&
                        <Button onClick={this.updateInfo.bind(this)}>Update</Button>
                    }
                    {
                        (this.state.display_info || this.state.display_file) &&
                        <Button onClick={this.refreshPage.bind(this)}>Back</Button>
                    }
                </Container>
                <Table striped bordered hover variant="dark">
                    {   // Display Directory Title
                        this.state.display_directory && 
                        <thead>
                            <tr>
                                <td>Directory</td>
                            </tr>
                        </thead>
                    }
                    {   // Display File Title
                        this.state.display_file &&
                        <thead>
                            <tr>
                                <td>#<input id="file_all" type="checkbox" value="All" onChange={this.selectAll.bind(this)} /></td>
                                <td>Name</td>
                                <td>Type</td>
                                <td>File</td>
                            </tr>
                        </thead>
                    }
                    {   // Display Directory info in database
                        this.state.display_info && this.state.list.length > 0 && 
                        <tbody>
                            <tr><td>Id</td><td>{this.state.list[0].id}</td></tr>
                            <tr><td>Title</td><td><Form.Control id={this.state.list[0].id+"_title"} as="textarea" onChange={this.textareaOnChange.bind(this)} value={this.state.list[0].title}></Form.Control></td></tr>
                            <tr><td>Visible</td><td><input id={this.state.list[0].id} type="checkbox" onChange={this.checkboxOnChange.bind(this)} checked={this.state.list[0].checked} /></td></tr>
                            <tr><td>Description</td><td><Form.Control id={this.state.list[0].id+"_description"} as="textarea"  onChange={this.textareaOnChange.bind(this)} value={this.state.list[0].description}></Form.Control></td></tr>
                            <tr><td colSpan="2"><Button id={this.state.list[0].id} onClick={this.getStorageFile.bind(this)}>View Directory File</Button></td></tr>
                        </tbody>
                    }
                    <tbody>
                    {   // Display Storage Directory List
                        this.state.display_directory && this.state.list.length > 0 && 
                        this.state.list.map(item => {
                            return (
                                <tr key={item.id}>
                                    <td id={item.name} onClick={this.viewDirectory.bind(this)}>{item.name}</td>
                                </tr>
                            )
                        })
                    }
                    {   // Display Storage File List
                        this.state.display_file && this.state.list.length > 0 &&
                        this.state.list
                        .sort((item1, item2) => item1.name > item2.name ? 1 : -1)
                        .map(item => {
                            return (
                                <tr key={item.id}>
                                    <td><input id={item.id} type="checkbox" type="checkbox" checked={item.checked} onChange={this.checkboxOnChange.bind(this)} /></td>
                                    <td>{item.name}</td>
                                    <td>{item.file_type}</td>
                                    <td>
                                        {
                                            item.file_type === "video" 
                                            ? 
                                            <video controls muted width="50px" height="50px">
                                                <source src={item.url} type="video/mp4" />
                                            </video>
                                            :
                                            <img src={item.url} alt={item.name} width="50px" height="50px" download />
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default StorageTable