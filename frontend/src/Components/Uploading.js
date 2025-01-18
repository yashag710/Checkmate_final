import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Sun, SlidersHorizontal as ArrowsHorizontal, Lock, Info, Check } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Uploading() {
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      alert('Error accessing camera: ' + err.message);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
            const ctx = canvasRef.current.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            setShowCanvas(true);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && stream) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      const ctx = canvasRef.current.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      setShowCanvas(true);
    }
  };

  const resetToInitialState = useCallback(() => {
    setShowCanvas(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const uploadPhoto = async () => {
    if (canvasRef.current) {
      try {
        setIsUploading(true);
        
        // Get the canvas data as blob
        const blob = await new Promise(resolve => {
          canvasRef.current.toBlob(resolve, 'image/png');
        });
        
        if (!blob) {
          throw new Error('Failed to create blob from canvas');
        }

        // Create FormData
        const formData = new FormData();
        formData.append('file', blob, 'photo.png'); // Changed from 'photo' to 'file' to match server expectation
        formData.append('userId', "678b9b784ac00cae0fdc20ce");

        // Using hardcoded URL for testing - replace with your actual backend URL
        const response = await axios.post(
          'http://localhost:5000/api/uploadImage/upload',  // Replace with your actual backend URL
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 30000,
          }
        );

        if (response.data) {
          alert('Photo uploaded successfully!');
          resetToInitialState(); // Reset after successful upload
          navigate("/patientAnalysis");
        } else {
          throw new Error('No response data received');
        }
        

      } catch (error) {
        console.error('Upload error details:', error);
        let errorMessage = 'Failed to upload photo. ';
        
        if (error.response) {
          // Server responded with an error
          errorMessage += `Server error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
        } else if (error.request) {
          // Request made but no response received
          errorMessage += 'No response from server. Please check if server is running.';
        } else {
          // Error in request setup
          errorMessage += error.message;
        }
        
        alert(errorMessage);
      } finally {
        setIsUploading(false);
      }
    }
  };


  return (
    <div className="bg-gray-100 w-full">
      <div id="imageCapture" className="min-h-screen p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Image Capture</h1>
          <p className="text-gray-600">Follow the guidelines for optimal analysis results</p>
        </div>

        {/* Capture Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Capture Section */}
          <div className="space-y-6">
            {/* Camera Preview */}
            <div className="aspect-video bg-gray-900 rounded-lg border border-neutral-200/30 overflow-hidden relative">
              <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover ${!showCanvas && stream ? '' : 'hidden'}`}
              />
              <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full ${showCanvas ? '' : 'hidden'}`}
              />
              {!stream && !showCanvas && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <button
                      onClick={startCamera}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Camera
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4">
              {!showCanvas ? (
                <>
                  <button
                    onClick={capturePhoto}
                    className="flex items-center justify-center space-x-2 p-4 bg-white rounded-lg border border-neutral-200/30 hover:bg-gray-50 transition-colors"
                    disabled={!stream}
                  >
                    <Camera className="w-6 h-6 text-gray-600" />
                    <span>Capture Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="uploadPhoto"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="uploadPhoto"
                    className={`flex items-center justify-center space-x-2 p-4 bg-white rounded-lg border border-neutral-200/30 hover:bg-gray-50 transition-colors cursor-pointer ${
                      stream ? 'hidden' : ''
                    }`}
                  >
                    <Upload className="w-6 h-6 text-gray-600" />
                    <span>Upload Photo</span>
                  </label>
                </>
              ) : (
                <>
                  <button
                    onClick={resetToInitialState}
                    className="flex items-center justify-center space-x-2 p-4 bg-gray-200 rounded-lg border border-neutral-200/30 hover:bg-gray-300 transition-colors"
                    disabled={isUploading}
                  >
                    <span>Retake Photo</span>
                  </button>
                  <button
                    onClick={uploadPhoto}
                    disabled={isUploading}
                    className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isUploading ? 'Uploading...' : 'Continue'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Guidelines Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-neutral-200/30 p-6">
              <h3 className="text-lg font-semibold mb-4">Capture Guidelines</h3>
              
              <div className="space-y-4">
                {/* Lighting */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Sun className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Proper Lighting</h4>
                    <p className="text-gray-600 text-sm">
                      Ensure good, even lighting. Avoid harsh shadows and direct sunlight.
                    </p>
                  </div>
                </div>

                {/* Distance */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ArrowsHorizontal className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Optimal Distance</h4>
                    <p className="text-gray-600 text-sm">
                      Keep 12-18 inches distance for face capture. For nails, maintain 6-8 inches.
                    </p>
                  </div>
                </div>

                {/* Upload */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Lock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Photo Upload</h4>
                    <p className="text-gray-600 text-sm">Upload image with size less than 5MB</p>
                  </div>
                </div>
              </div>

              {/* Quality Check */}
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium flex items-center">
                  <Info className="w-5 h-5 text-yellow-500 mr-2" />
                  Quality Check
                </h4>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Clear, focused image
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Good lighting conditions
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Proper framing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Uploading;