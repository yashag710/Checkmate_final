import React from "react";
import Doctor from "../Assets/doctor-group.png";
import SolutionStep from "./SolutionStep";
import "../Styles/About.css";

function About() {
  return (
    <div className="about-section" id="about">
      <div className="about-image-content">
        <img src={Doctor} alt="Doctor Group" className="about-image1" />
      </div>

      <div className="about-text-content">
        <h3 className="about-title">
          <span>About Us</span>
        </h3>
        <p className="about-description">
        AyurVision uses an advanced AI model to analyze your symptoms and predict potential health conditions. This helps you understand your symptoms and receive timely, personalized healthcare recommendations before consulting with a specialist.
        </p>

        <h4 className="about-text-title">Your Solutions</h4>

        <SolutionStep
          title="Choose a Specialist"
          description="Find your perfect specialist and book with ease at Health Plus. Expert doctors prioritize your health, offering tailored care."
        />

        <SolutionStep
          title="Make a Schedule"
          description="Choose the date and time that suits you best, and let our dedicated team of medical professionals ensure your well-being with personalized care."
        />

        <SolutionStep
          title="Get Your Solutions"
          description="Our experienced doctors and specialists are here to provide expert advice and personalized treatment plans, helping you achieve your best possible health."
        />

        <SolutionStep
          title="AI-Powered Symptom Prediction"
          description="MediCare offers an innovative AI-trained model that analyzes your symptoms to predict potential conditions, helping you take early action and consult a specialist at the right time."
        />
      </div>
    </div>
  );
}

export default About;
