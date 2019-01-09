import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import Cookies from 'universal-cookie'
import axios from 'axios';

import Menu from '@material-ui/core/Menu';
import AppBar from 'material-ui/AppBar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar'
import './App.css';

/*import logo from './logo.png';
import Menu from './Menu/Menu.js';
import searchIcon from './search-icon.png';*/

import Home from './components/Home/Home'
import ManageUsers from './components/ManageUsers/ManageUsers'
import Login from './components/Login/Login'
import Logout from './components/Logout/Logout'
import Registrer from './components/Registrer/Registrer'

const cookies = new Cookies();

const paperStyle = {
  height: '87%',
  width: "96%",
  margin: '2%',
  marginTop: '5%',
  textAlign: 'center',
  display: 'inline-block',
};


const style = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    cursor: "pointer",
}

var showLoginMenu = true;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      show: "home",
      anchorEl: null,
      ProfileMenuOpen: false,
      links: [
        { name: "home", text: "Home" }
      ]
    }
  }  

  handlerToggle = () => this.setState({open: !this.state.open});

  show(str) {
    this.setState({show: str, open: false });

    if (cookies.get("token") === undefined) {
      if (showLoginMenu) {
        this.state.links.push({ name: "login", text: "Login" });
      }
      showLoginMenu = false;
    }
  };

  render() {

    let showLinks = this.state.links.map((link, index) => {
      return (
        <MenuItem key={index} onClick={(event) => this.show(link.name)}>{link.text}</MenuItem>
      )
    });

    let content = null;
    switch (this.state.show) {
      case "login":
        content = (<Login loadHome={(event) => this.show("home")} loadNext={(event) => this.show("registrer")} />)
        break;
      case "registrer":
        content = (<Registrer loadHome={(event) => this.show("home")} />)
        break;
      case "home":
        content = (<Home />);
        break;
      case "logout":
        content = (<Logout />);
        break;
      case "manageUsers":
        content = (<ManageUsers />);
        break;
      default:
        break;
    }

    if (cookies.get("token") === undefined) {
      if (showLoginMenu) {
        this.state.links.push({ name: "login", text: "Login" });
      }
      showLoginMenu = false;
    } else {
      var t = this;
      axios.get('http://127.0.0.1:4000/validateUser?uid=' + cookies.get("token")).then(function (response) {
        var ret = response.data;
        console.log(ret);
        if (ret.code === undefined) {
          if (ret.userType === "ADMIN") {
            //t.show("manageUsers");
            t.state.links.push({ name: "manageUsers", text: "Manage users" });
          }
        } else {
          cookies.remove("token");
          //t.show("login");
          window.location.reload();
        }
      });
    }

    return (
      <div>
        
        <AppBar 
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          title="test"
          onLeftIconButtonClick={this.handlerToggle}>
          
          <Toolbar style={{"backgroundColor": "inherit"}}>
            {showLoginMenu && (
                <div>
                  <IconButton
                    aria-owns={this.state.ProfileMenuOpen ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    onClick={(event) => this.setState({ ProfileMenuOpen: !this.state.ProfileMenuOpen, anchorEl: event.currentTarget })}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={this.anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={this.state.ProfileMenuOpen}
                    onClose={(event) => this.setState({ anchorEl: null, ProfileMenuOpen: false })}>
                    <MenuItem onClick={(event) => this.show("logout")}>Logout</MenuItem>
                  </Menu>
                </div>
              )} 
          </Toolbar>
        </AppBar>
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}>

          <AppBar title="test" />
          {showLinks}

        </Drawer>
        <div style={style} id="overlay">
          <Paper style={paperStyle} zDepth={5}>
            {content}
          </Paper>
        </div>
        

      </div>
    );
  }
}

//export { showRegistrer };

export default App;
