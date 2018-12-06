import React, { Component } from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      loading: true,
      feeds: '',
      fontSize: 14,
      fontColor: 'lightgray',
      headlineColor: 'black',
      backgroundColor: 'white',
      feedCount: 0,
      successMessage: '',
      errorMessage: ''
    }
  }

  componentWillMount() {
    //check user login token
    checkLogin((err, token) => {
      if (err)
        return browserHistory.push('/login');

      //get logged in users info
      axios.defaults.headers.common['Authorization'] = 'bearer '+ token;
      axios.get('http://localhost:8000/api/ping' )
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
    this.setState({loading: true, feedCount: 0, successMessage: '', errorMessage: ''});
    const data= {
      link: link && typeof link === 'string'?link:this.state.link
    };

    axios.post('http://localhost:8000/api/feeds', data)
    .then(response => {
      const feeds = JSON.parse(response.data.data);
      const feedCount = feeds.items.length;
      this.setState({loading: false, feeds: feeds, feedCount: feedCount, successMessage: "Fetched Successfully"});
    })
    .catch(error => {
      toast('Fetch failed', toastConfig);
      this.setState({loading: false, errorMessage: "Fetch failed"});
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
    axios.put('http://localhost:8000/api/user', data)
    .then(response => {
      this.setState({feeds: JSON.parse(response.data.data)});
      toast('Configuration Saved', toastConfig);
    })
    .catch(error => {
      if(error.response)
        toast('Error Saving Configuration', toastConfig);
      else
        toast('Configuration Saved', toastConfig);
    });
  }

  render() {
    const { link, loading, feedCount, successMessage, errorMessage } = this.state;

    return (
      <div className="Dashboard">
        <Header
          link={link}
          loading={loading}
          feedCount={feedCount}
          successMessage={successMessage}
          errorMessage={errorMessage}
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
