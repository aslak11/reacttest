import React, { Component } from 'react';
import axios from 'axios';
import { sha256, sha224 } from 'js-sha256';
import Cookies from 'universal-cookie';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { App } from '../../App';

const cookies = new Cookies();

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password : '',
            error: ''
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegistrer = this.handleRegistrer.bind(this);
    }

    handleLogin(e) {
        e.preventDefault();
        var t = this;

        axios.get('http://127.0.0.1:4000/validateUser?email=' + this.state.email + '&password='+ sha256(this.state.password)).then(function (response) {
            var ret = response.data;

            if (ret.code === undefined) {
                cookies.set("token", ret.uid);
                //t.props.loadHome();
                window.location.reload();
            } else {
                t.setState({ error: ret.message });
            }
        });
    }

    handleRegistrer = () => {
        //this.App.showRegistrer() // do stuff
        this.App.setState({show: "registrer", open: false });
    }

    render() {
        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <AppBar
                            title="Login"
                        />
                        <TextField
                            hintText="Enter your email"
                            floatingLabelText="Email"
                            onChange = {(event,newValue) => this.setState({email:newValue, error:''})}
                        />
                        <br/>
                        <TextField
                            type="password"
                            hintText="Enter your password"
                            floatingLabelText="Password"
                            onChange = {(event,newValue) => this.setState({password:newValue, error:''})}
                        />
                        <br/>
                        <p style={{"color": "#ff0000"}}>{this.state.error}</p>
                        <br/>
                        <RaisedButton label="Login" primary={true} style={style} onClick={this.handleLogin}/>
                        <br/>
                        <RaisedButton label="Registrer" primary={true} style={style} onClick={this.props.loadNext} />
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}
const style = {
    margin: 15,
};

export default Login;