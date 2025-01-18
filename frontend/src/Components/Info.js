import React from "react";
import InformationCard from "./InformationCard";
import { faHeartPulse, faTruckMedical, faTooth } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Info.css";

function Info() {
  return (
    <div className="info-section" id="services">
      <div className="info-title-content">
        <h3 className="info-title">
          <span>What We Do</span>
        </h3>
        <p className="info-description">
        We develop a health analysis and evaluation system using image and video analysis to provide personalized Ayurveda insights based on facial and nail characteristics.
        </p>
      </div>

      <div className="info-cards-content">
        {/* <InformationCard
          title="Emergency Care"
          description="Our Emergency Care service is designed to be your reliable support
            in critical situations. Whether it's a sudden illness, injury, or
            any medical concern that requires immediate attention, our team of
            dedicated healthcare professionals is available 24/7 to provide
            prompt and efficient care."
          icon={faTruckMedical}
        /> */}

<InformationCard
          title="Facial Analysis"
          description="Our AI-trained model analyzes your facial features, including skin tone, texture, dark circles, and spots, to provide a comprehensive health assessment. By processing your images, it detects potential skin conditions and provides personalized recommendations for improvement."
          icon={faHeartPulse}
        />

        <InformationCard
          title="Nail Analysis "
          description="Using advanced AI technology, our system examines nail color, texture, and shape to identify any irregularities or health concerns. The analysis helps detect early signs of conditions, offering insights and guidance for better nail care."
          icon={faTooth}
        />
      </div>
    </div>
  );
}

export default Info;
