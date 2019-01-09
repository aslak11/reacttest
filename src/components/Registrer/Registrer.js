import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { sha256, sha224 } from 'js-sha256';


const cookies = new Cookies();

class Registrer extends Component {
    constructor(props) {
        super(props);
        this.state={
            email:'',
            name:'',
            password:'',
            password1:'',
            error: ''
        }
        this.handleRegistrer = this.handleRegistrer.bind(this);
    }

    handleRegistrer(e) {
        e.preventDefault();
        var t = this;

        if (this.state.password === this.state.password1) {
            axios.get('http://127.0.0.1:4000/createUser?email=' + this.state.email + '&name='+ this.state.name + '&password='+ sha256(this.state.password)).then(function (response) {
                var ret = response.data;

                if (ret.code === undefined) {
                    cookies.set("token", ret.uid);
                    //t.props.loadHome();
                    window.location.reload();
                } else {
                    t.setState({ error: ret.message });
                }
            })
        } else {
            this.state.error = "Passwords are not equal";
        }
        
        this.state.password = "";
        this.state.password1 = "";
    }

    render() {
        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <AppBar
                            title="Registrer"
                        />
                        <TextField
                            hintText="Enter your email"
                            floatingLabelText="Email"
                            onChange = {(event,newValue) => this.setState({email:newValue, error:''})}
                        />
                        <br/>
                        <TextField
                            hintText="Enter your full name"
                            floatingLabelText="Name"
                            onChange = {(event,newValue) => this.setState({name:newValue, error:''})}
                        />
                        <br/>
                        <TextField
                            type="password"
                            hintText="Enter your password"
                            floatingLabelText="Password"
                            onChange = {(event,newValue) => this.setState({password:newValue, error:''})}
                        />
                        <br/>
                        <TextField
                            type="password"
                            hintText="Retype password"
                            floatingLabelText="Password"
                            onChange = {(event,newValue) => this.setState({password1:newValue, error:''})}
                        />
                        <br/>
                        <p style={{"color": "#ff0000"}}>{this.state.error}</p>
                        <br/>
                        <RaisedButton label="Registrer" primary={true} style={style} onClick={this.handleRegistrer}/>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}
const style = {
    margin: 15,
};

export default Registrer;