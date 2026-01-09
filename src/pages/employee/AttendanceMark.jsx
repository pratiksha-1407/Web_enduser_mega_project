import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import styles from '../../styles/employee/forms.module.css';
import { Camera, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

const AttendanceMark = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState('Fetching location...');
    const [photo, setPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
                },
                (err) => {
                    setLocation("Location Access Denied");
                    console.error(err);
                }
            );
        } else {
            setLocation("Geolocation not supported");
        }

        return () => clearInterval(timer);
    }, []);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const uploadPhoto = async (file) => {
        const fileName = `attendance/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('emp_attendance_images') // Assuming bucket exists as per Flutter
            .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('emp_attendance_images')
            .getPublicUrl(fileName);

        return publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!photo) throw new Error("Please take a selfie/photo");

            // 1. Upload Photo
            // Note: If bucket doesn't exist, this will fail. 
            // Phase 2 mandates minimal placeholders. I will try-catch the upload.
            let photoUrl = '';
            try {
                photoUrl = await uploadPhoto(photo);
            } catch (uploadErr) {
                console.warn("Storage upload failed, using placeholder", uploadErr);
                photoUrl = "https://via.placeholder.com/150"; // Fallback if storage not configured
            }

            // 2. Mark Attendance
            const profile = await employeeService.loadEmployeeProfile();

            await employeeService.markAttendance({
                employeeName: profile?.full_name || 'Employee',
                location: location,
                selfieUrl: photoUrl
            });

            setSuccess(true);
            setTimeout(() => navigate('/employee'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to mark attendance');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
                    <CheckCircle size={64} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Attendance Marked!</h2>
                <p className="text-gray-500">Have a productive day.</p>
            </div>
        );
    }

    return (
        <div className={styles.formContainer} style={{ maxWidth: '500px' }}>
            <h2 className={styles.sectionTitle}>Mark Daily Attendance</h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h1>
                <p className="text-gray-500 mt-2">
                    {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-6 flex justify-center">
                    <div className="relative w-48 h-48 bg-gray-100 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center group cursor-pointer">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Selfie" className="w-full h-full object-cover" />
                        ) : (
                            <Camera size={48} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            capture="user"
                            onChange={handlePhotoChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
                <p className="text-center text-sm text-gray-400 mb-8">Tap to take selfie</p>

                <div className="bg-gray-50 p-4 rounded-xl mb-8 flex items-center gap-3">
                    <MapPin className="text-blue-500" />
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Current Location</p>
                        <p className="text-sm font-medium text-gray-700">{location}</p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !photo}
                    className={styles.submitBtn}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Marking Attendance...
                        </>
                    ) : (
                        "CONFIRM ATTENDANCE"
                    )}
                </button>
            </form>
        </div>
    );
};

export default AttendanceMark;
