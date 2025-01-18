import React, { useEffect, useState } from "react";

function PatientAnalysis() {
  const [patientData, setPatientData] = useState({
    info: "",
    remedy: [],
    about: [],
    causes: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getReport = async () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    
    if (!baseUrl) {
      setError("API base URL is not configured");
      setIsLoading(false);
      return;
    }

    const cleanBaseUrl = baseUrl.replace(/;+$/, '');
    const apiUrl = `${cleanBaseUrl}/api/uploadImage/analysis`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: "678b9b784ac00cae0fdc20ce" })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Directly set the content from the API response
      setPatientData(data.choices[0].message.content);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError(`Failed to load patient analysis: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getReport();
  }, []);

  // Rest of the component remains exactly the same...
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading patient analysis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          <p>{error}</p>
          <button 
            onClick={getReport}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Patient Analysis</h1>
        <p className="text-gray-600">Review and analyze patient health data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <img
                src="/api/placeholder/100/100"
                alt="Patient"
                className="w-16 h-16 rounded-full"
              />
              <div className="ml-4">
                <h3 className="text-xl font-semibold">Sarah Johnson</h3>
                <p className="text-gray-500">ID: #PAT-2024-001</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Age</span>
                <span className="font-medium">32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender</span>
                <span className="font-medium">Female</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Visit</span>
                <span className="font-medium">Jan 15, 2024</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Remedies</h3>
              <ul className="space-y-2">
                {patientData.remedy?.length > 0 ? (
                  patientData.remedy.map((remedy, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">•</span>
                      {remedy}
                    </li>
                  ))
                ) : (
                  <li>No remedies found</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Condition Information</h3>
                <div className="space-y-4">
                  {patientData.info && (
                    <div className="border-b pb-4">
                      <p className="text-gray-700">{patientData.info}</p>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skin Around</span>
                    <span className="text-gray-700">
                      Dry and slightly inflamed around the infected nails.
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Infection Image</h3>
                <img
                  src="/api/placeholder/300/200"
                  alt="Condition"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">About the Condition</h3>
            <ul className="space-y-2">
              {patientData.causes?.length > 0 ? (
                patientData.causes.map((cause, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2">•</span>
                    {cause}
                  </li>
                ))
              ) : (
                <li>No additional details provided</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientAnalysis;