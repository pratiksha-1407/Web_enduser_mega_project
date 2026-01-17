
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { employeeService } from '../../services/employeeService';
import { Camera, MapPin, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import styles from '../../styles/employee/attendance.module.css';

const AttendanceMark = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // State
    const [step, setStep] = useState(1); // 1: Location, 2: Camera, 3: Success
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        // Fetch profile for name
        const loadProfile = async () => {
            const data = await employeeService.loadEmployeeProfile();
            setProfile(data);
        };
        loadProfile();

        return () => clearInterval(timer);
    }, []);

    const getLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    // Reverse geocode or just use coords
                    const { latitude, longitude } = position.coords;
                    // Mock address fetch for now
                    setLocation({
                        coords: { latitude, longitude },
                        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                    });
                    setLoading(false);
                    setStep(2); // Move to camera
                    startCamera();
                },
                (error) => {
                    setLocationError("Unable to retrieve your location. Please enable GPS.");
                    setLoading(false);
                }
            );
        } else {
            setLocationError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access error:", err);
            alert("Unable to access camera.");
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvasRef.current.toDataURL('image/jpeg');
            setCapturedImage(dataUrl);
            stopCamera();
        }
    };

    const dataURLtoBlob = (dataurl) => {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    const submitAttendance = async () => {
        if (!location || !capturedImage) return;
        setLoading(true);
        try {
            // Upload Image
            const blob = dataURLtoBlob(capturedImage);
            const selfieUrl = await employeeService.uploadAttendanceImage(blob);

            // Mark Attendance
            await employeeService.markAttendance({
                employeeName: profile?.full_name || user?.email || 'Unknown',
                location: location.address,
                selfieUrl: selfieUrl
            });
            setStep(3);
        } catch (error) {
            console.error(error);
            alert("Failed to mark attendance. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setCapturedImage(null);
        startCamera();
    };

    return (
        <div className={styles.container}>
            <div className={styles.welcomeSection}>
                <h1>Daily Attendance</h1>
                <p>{currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentTime.toLocaleTimeString()}</p>
            </div>

            <div className={styles.card}>
                {/* Step Progress */}
                <div className={styles.stepProgress}>
                    <div className={`${styles.stepItem} ${step >= 1 ? styles.stepActive : ''}`}>
                        1. Location
                    </div>
                    <div className={`${styles.stepItem} ${step >= 2 ? styles.stepActive : ''}`}>
                        2. Selfie
                    </div>
                    <div className={`${styles.stepItem} ${step >= 3 ? styles.stepActive : ''}`}>
                        3. Confirm
                    </div>
                </div>

                <div className={styles.content}>
                    {step === 1 && (
                        <div className={styles.locationStep}>
                            <div className={styles.locationIcon}>
                                <MapPin size={32} />
                            </div>
                            <h3 className={styles.stepTitle}>Identify Location</h3>
                            <p className={styles.stepDesc}>
                                We need to verify your location to mark your attendance. Please ensure you are at the workplace.
                            </p>

                            {locationError && (
                                <div className={styles.locationError}>
                                    <AlertTriangle size={18} />
                                    {locationError}
                                </div>
                            )}

                            <button
                                onClick={getLocation}
                                disabled={loading}
                                className={styles.primaryButton}
                            >
                                {loading ? 'Fetching Location...' : 'Get My Location'}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className={styles.cameraStep}>
                            {!capturedImage ? (
                                <div className={styles.cameraView}>
                                    <video ref={videoRef} autoPlay playsInline muted className={styles.videoElement}></video>
                                    <canvas ref={canvasRef} className={styles.hidden}></canvas>
                                </div>
                            ) : (
                                <div className={styles.cameraView}>
                                    <img src={capturedImage} alt="Selfie" className={styles.capturedImage} />
                                </div>
                            )}

                            <p className={styles.stepDesc}>
                                {capturedImage ? "Photo captured. Submit if clear." : "Take a clear selfie to verify identity."}
                            </p>

                            <div className={styles.buttonGroup}>
                                {!capturedImage ? (
                                    <button
                                        onClick={capturePhoto}
                                        className={styles.captureButton}
                                    >
                                        <Camera size={20} /> Capture
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={reset}
                                            className={styles.secondaryButton}
                                        >
                                            <RefreshCw size={20} /> Retake
                                        </button>
                                        <button
                                            onClick={submitAttendance}
                                            disabled={loading}
                                            className={styles.submitButton}
                                        >
                                            {loading ? 'Submitting...' : 'Submit Attendance'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className={styles.successStep}>
                            <div className={styles.successIcon}>
                                <CheckCircle size={32} />
                            </div>
                            <h3 className={styles.stepTitle}>Attendance Marked!</h3>
                            <p className={styles.stepDesc}>
                                You have successfully checked in for today at <br />
                                <span className={styles.timeText}>{currentTime.toLocaleTimeString()}</span>
                            </p>
                            <button
                                onClick={() => navigate('/employee')}
                                className={styles.darkButton}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceMark;
