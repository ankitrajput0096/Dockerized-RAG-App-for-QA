import React from "react";
import "./app.component.css"; // Assume CSS is handled in LandingPage.css

import RobotImage from "../assets/Picture1.png";
import DataExtractionImage from "../assets/Picture2.png";
import { NavLink } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <main className="main-content">
        <h1 className="headline">QueryPal 
          <br></br>
          Personalized AI Friend</h1>
        <p className="subtext">
        I’m here as your friendly companion for chats, questions, or casual conversations. 
        <br></br>
        Upload a text file, and I’ll help you quickly find key information. Making your 
        <br></br>
        experience easy and enjoyable is my goal!
        </p>
        <NavLink to='/about' style={{"text-decoration": "none"}}>
          <div className="cta-buttons">
            <button className="cta-button primary">Find a friend or an expert</button>
          </div>
        </NavLink>
        <div className="illustrations">
          <div className="illustration-left">
            <img src={DataExtractionImage} alt="Person using a phone" />
          </div>
          <div className="illustration-right">
            <img src={RobotImage} alt="Person working on a laptop" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
