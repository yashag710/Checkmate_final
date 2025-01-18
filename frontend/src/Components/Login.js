import React, { useState } from 'react';
import '../Styles/Login.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const LoginSignUp = () => {
    const initialFormState = {
        email: '',
        otp: '',
        name: '',
        password: '',
        loginEmail: '',
        loginPassword: '',
    };

    const [action, setAction] = useState("Sign Up");
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialFormState);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const clearError = () => setError('');
    
    const resetForm = () => {
        setFormData(initialFormState);
        setError('');
        setIsLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value.trim()
        }));
        clearError();
    };

    const validateEmail = (email) => {
        return email && email.includes('@') && email.includes('.');
    };

    const validateForm = (type) => {
        switch (type) {
            case 'login':
                if (!formData.loginEmail || !formData.loginPassword) {
                    setError('Please enter both email and password');
                    return false;
                }
                if (!validateEmail(formData.loginEmail)) {
                    setError('Please enter a valid email address');
                    return false;
                }
                break;
            case 'email':
                if (!validateEmail(formData.email)) {
                    setError('Please enter a valid email address');
                    return false;
                }
                break;
            case 'signup':
                if (!formData.name || !formData.password || !formData.otp) {
                    setError('Please fill in all fields');
                    return false;
                }
                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters long');
                    return false;
                }
                break;
            default:
                return true;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateForm('login')) return;

        try {
            setIsLoading(true);
            clearError();

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.loginEmail,
                    password: formData.loginPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token in localStorage or context
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Success notification
            alert('Login successful!');
            
            // Reset form
            resetForm();
            
            // Redirect or update app state here
            
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = async () => {
        if (!validateForm('email')) return;

        try {
            setIsLoading(true);
            clearError();

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/user/request-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send OTP');
            }

            setStep(2);
        } catch (error) {
            setError(error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!validateForm('signup')) return;

        try {
            setIsLoading(true);
            clearError();

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    otp: formData.otp,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            // Success notification
            alert('Signup successful! Please login.');
            
            // Reset form and switch to login
            resetForm();
            setAction('Login');
            
        } catch (error) {
            setError(error.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const InputField = ({ type, name, placeholder, value, onChange, icon, disabled = false }) => (
        <div className="input">
            <img src={icon} alt="" />
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    );

    const renderStep1 = () => (
        <div className="inputs">
            <InputField
                type="email"
                name="email"
                placeholder="Enter E-mail"
                value={formData.email}
                onChange={handleInputChange}
                icon={email_icon}
            />
            <div className="submit-container">
                <button 
                    className="submit" 
                    onClick={handleEmailSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Continue'}
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="inputs">
            <InputField
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleInputChange}
                icon={user_icon}
            />
            <InputField
                type="email"
                value={formData.email}
                icon={email_icon}
                disabled={true}
            />
            <InputField
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleInputChange}
                icon={password_icon}
            />
            <InputField
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleInputChange}
                icon={password_icon}
            />
            <div className="submit-container">
                <button 
                    className="submit" 
                    onClick={handleSignUp}
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
            </div>
        </div>
    );

    const renderLoginForm = () => (
        <>
            <div className="inputs">
                <InputField
                    type="email"
                    name="loginEmail"
                    placeholder="Enter E-mail"
                    value={formData.loginEmail}
                    onChange={handleInputChange}
                    icon={email_icon}
                />
                <InputField
                    type="password"
                    name="loginPassword"
                    placeholder="Enter Password"
                    value={formData.loginPassword}
                    onChange={handleInputChange}
                    icon={password_icon}
                />
            </div>
            <div className="submit-container">
                <button 
                    className="submit" 
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </div>
            <div className="forgot-password">
                Lost Password? <span>Click Here!</span>
            </div>
        </>
    );

    return (
        <div className="container">
            <div className="header">
                <div className="text">{action === "Login" ? "Login" : "Sign Up"}</div>
                <div className="underline"></div>
            </div>

            {error && (
                <div className="alert error">
                    <p>{error}</p>
                </div>
            )}

            {action === "Login" ? (
                renderLoginForm()
            ) : (
                <>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                </>
            )}

            <div className="submit-container">
                <button
                    className={action === "Login" ? "submit gray" : "submit"}
                    onClick={() => {
                        setAction("Sign Up");
                        setStep(1);
                        resetForm();
                    }}
                >
                    Sign Up
                </button>
                <button
                    className={action === "Sign Up" ? "submit gray" : "submit"}
                    onClick={() => {
                        setAction("Login");
                        resetForm();
                    }}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginSignUp;