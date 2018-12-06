import React, { Component } from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';

import { Header, Sidebar, Feeds } from 'components';
import { checkLogin, logout } from 'services/common';
import './Dashboard.css';
import 'react-rangeslider/lib/index.css'

const toastConfig = {
  position: toast.POSITION.BOTTOM_LEFT,
  autoClose: 2000,
  className: 'toast-style'
};

/*************************************************
  Dashboard Statefull Component
**************************************************/

class Dashboard extends Component {
  constructor(props) {
    super(props);
    //initial state
    this.state = {
      user: '',
      isVisible: false,
      link: '',
      feeds: '',
      fontSize: 14,
      fontColor: 'lightgray',
      headlineColor: 'black',
      backgroundColor: 'white'
    }
  }

  componentWillMount() {
    //check user login token
    checkLogin((err, token) => {
      if (err)
        return browserHistory.push('/login');

      //get logged in users info
      axios.defaults.headers.common['Authorization'] = 'bearer '+ token;
      axios.get('https://rss-feed-backend.herokuapp.com/api/ping' )
      .then(response => {

        const user = response.data.data.user;
        const { link, fontSize, fontColor, headlineColor, backgroundColor } = this.state;

        //user's updated state
        this.setState({
          user: user,
          link: user.link?user.link:link,
          fontSize: user.fontSize?Number(user.fontSize):fontSize,
          fontColor: user.fontColor?user.fontColor:fontColor,
          headlineColor: user.headlineColor?user.headlineColor:headlineColor,
          backgroundColor: user.backgroundColor?user.backgroundColor:backgroundColor
        });

        //fetch save rss link feeds
        if(user.link)
          this.fetchFeeds(user.link);
      })
      .catch(function (error) {
        logout();
      });
    });
  }

  /***
   **Toggles sidebar
   ***/
  updateModal(isVisible) {
    this.setState({isVisible});
    this.forceUpdate();
  }

  /***
   **Handles state change
   ***/
  handleChange = (e) => {
    this.setState({[e.target.id]: e.target.value});
  }

  /***
   **Gets RSS feed
   ***/
  fetchFeeds = (link) => {
    const data= {
      link: link?link:this.state.link
    };

    axios.post('https://rss-feed-backend.herokuapp.com/api/feeds', data)
    .then(response => {
      this.setState({feeds: JSON.parse(response.data.data)});
    })
    .catch(function (error) {
      toast('Payout Successful', toastConfig)
      console.log(error.response, '========================');
    });
  }

  /***
   **Handles font size state change
   ***/
  handleFontSize = (value) => {
    this.setState({
      fontSize: value
    })
  }

  /***
   **Handles Color change
   ***/
  handleColorChange = (value, state) => {
    this.setState({
      [state]: value.hex
    });
  }

  /***
   **Saves user's configs
   ***/
  saveConfigs = () => {
    const { link, fontSize, fontColor, headlineColor, backgroundColor } = this.state;
    let cookie = localStorage.getItem('authToken');
    cookie = cookie
      ? JSON.parse(cookie)
      : null;

    if(!cookie)
      return;

    const data = {
      token: cookie.token,
      email: cookie.user.email,
      link: link,
      fontSize: fontSize,
      fontColor: fontColor,
      headlineColor: headlineColor,
      backgroundColor: backgroundColor
    };

    //Put request to save user's details
    axios.put('https://rss-feed-backend.herokuapp.com/api/user', data)
    .then(response => {
      this.setState({feeds: JSON.parse(response.data.data)});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    const { link } = this.state;

    return (
      <div className="Dashboard">
        <Header
          link={link}
          handleChange={this.handleChange}
          fetchFeeds={this.fetchFeeds}
        />
        <Sidebar
          updateModal={this.updateModal}
          handleFontSize={this.handleFontSize}
          handleColorChange={this.handleColorChange}
          saveConfigs={this.saveConfigs}
          {...this.state}
        />
        <div className="content">
          <Feeds {...this.state} />
        </div>
        <ToastContainer hideProgressBar={true} />
      </div>
    );
  }
}

export default Dashboard;
