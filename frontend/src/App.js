import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Legal from "./Pages/Legal";
import NotFound from "./Pages/NotFound";
import Appointment from "./Pages/Appointment";
import Login from "./Components/Login";  // Ensure Login is correctly imported
import Uploading from "./Components/Uploading";
import PatientAnalysis from "./Components/PatientAnalysis";

function App() {
  return (
    <div className="App">
      <Router basename="/Health-Plus">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />  {/* Login Route */}
          <Route path="/legal" element={<Legal />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="*" element={<NotFound />} />  
          <Route path="/uploading" element={<Uploading/>}/>{/* Handle 404 page */}
          <Route path="/patientAnalysis" element={<PatientAnalysis/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
