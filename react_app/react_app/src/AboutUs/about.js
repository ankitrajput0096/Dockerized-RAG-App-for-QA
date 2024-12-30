import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as IncDecActions, selectors as IncDecSelectors } from './duck';
import Loader from '../Loader/loader';

import "./about.css";

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postName: '',
      conversation: [],
      lastPostData: null,
      isResetting: false, // Flag to prevent updates during reset
      fileUploaded: false, // State to track if a file has been uploaded
      fileContent: '',
    };
  }

  static propTypes = {
    postData: PropTypes.string.isRequired,
  };

  handleHomePageChange = () => {
    const { resetReduxState } = this.props;
    resetReduxState();
    this.setState({
      conversation: [],
      lastPostData: null,
      isResetting: true, // Block updates from getDerivedStateFromProps
    }, () => {
      // Re-enable updates after resetting
      this.setState({ isResetting: false });
    });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = () => {
        // console.log('File content:', reader.result);
        // You can process the file content here
        this.setState({fileContent: reader.result});
      };
      reader.readAsText(file);
      this.setState({ fileUploaded: true }); // Update state to indicate file upload
    } else {
      alert('Please upload a valid .txt file');
    }
  };

  handleSubmit = (Type) => {
    const { postMethodCall, postMethodCallWithText } = this.props;
    if (Type === 'postAPI') {
      const userMessage = this.state.postName;

      const fileContent = this.state.fileContent;

      this.setState((prevState) => ({
        conversation: [...prevState.conversation, { sender: 'User', message: userMessage }],
        postName: '',
        fileContent: '',
        fileUploaded: false,
      }));

      if(fileContent.length > 0) {
        postMethodCallWithText(fileContent, userMessage);
      } else {
        postMethodCall(userMessage);
      }
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { postData } = nextProps;

    // Prevent updates during reset
    if (prevState.isResetting) {
      return null;
    }

    if (postData && postData !== prevState.lastPostData) {
      return {
        conversation: [...prevState.conversation, { sender: 'AI Friend', message: postData }],
        lastPostData: postData,
      };
    }
    return null;
  }

  _renderPostData() {
    const { fileUploaded } = this.state;

    return (
      <div className="chat-box">
        <div className="chat-input">
          <label
            htmlFor="file-input"
            className={`plus-input ${fileUploaded ? 'file-selected' : ''}`} // Add conditional class
            title=""
          >
            +
          </label>
          <input
            type="file"
            id="file-input"
            accept=".txt"
            onChange={this.handleFileUpload}
            style={{ display: 'none' }} // Hides the file input element
          />
          <span>
            <input
              type="text"
              placeholder="Type your message here..."
              className="text-input"
              value={this.state.postName}
              onChange={(e) => this.handleChange(e)}
              name="postName"
            />
          </span>
        </div>
        <button className="submit-button" onClick={() => this.handleSubmit('postAPI')}>Submit</button>
      </div>
    );
  }

  _renderConversation() {
    return (
      <div className="conversation-container">
        {this.state.conversation.map((entry, index) => (
          <div
            key={index}
            className={`chat-message ${entry.sender === 'User' ? 'user-message' : 'server-message'}`}
          >
            <strong>{entry.sender}:</strong> {entry.message}
          </div>
        ))}
      </div>
    );
  }

  _showTitle() {
    if (this.state.conversation.length === 0) {
      return (
        <div className="version-toggle">
          <h2 className="chat-title">What can I help with?</h2>
        </div>
      );
    }
    return null;
  }

  render() {
    const { isFetching } = this.props;
    if (isFetching) {
      return (
        <h1>
          <Loader />
        </h1>
      );
    } else {
      return (
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div className="header-left">
              <h1 className="title">Chat UI</h1>
            </div>
            <div className="header-right">
              <div className="version-toggle">
                <NavLink to='/'>
                  <button className="version-button left-button" onClick={this.handleHomePageChange}>Homepage</button>
                </NavLink>
                <button className="version-button right-button active">Chat UI</button>
              </div>
            </div>
          </header>
          <main className="dashboard-main">
            {this._showTitle()}
            {this._renderConversation()}
            {this._renderPostData()}
          </main>
          <footer className="dashboard-footer">
            <p>
              Personal Project, this may produce inaccurate information
              about people, places, or facts.
            </p>
          </footer>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  isFetching: IncDecSelectors.isFetching(state),
  postData: IncDecSelectors.postApiData(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      postMethodCall: IncDecActions.postMethodCall,
      resetReduxState: IncDecActions.resetReduxState,
      postMethodCallWithText: IncDecActions.postMethodCallWithText,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
