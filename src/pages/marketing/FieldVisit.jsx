import { useState, useEffect } from 'react';
import { marketingService } from '../../services/marketingService';
import { supabase } from '../../services/supabaseClient';
import styles from '../../styles/marketing/visit.module.css';
import {
    Store,
    Camera,
    Image as ImageIcon,
    CheckCircle,
    X,
    Upload,
    Loader2
} from 'lucide-react';

const FieldVisit = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [enterpriseName, setEnterpriseName] = useState('');
    const [selfie, setSelfie] = useState(null);
    const [meterPhoto, setMeterPhoto] = useState(null);
    const [previews, setPreviews] = useState({ selfie: null, meter: null });

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'selfie') {
                setSelfie(file);
                setPreviews(prev => ({ ...prev, selfie: URL.createObjectURL(file) }));
            } else {
                setMeterPhoto(file);
                setPreviews(prev => ({ ...prev, meter: URL.createObjectURL(file) }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!enterpriseName || !selfie || !meterPhoto) {
            alert('All fields and 2 photos are required!');
            return;
        }

        try {
            setLoading(true);

            // 1. Upload Images
            const selfieUrl = await marketingService.uploadVisitPhoto(selfie, 'selfies');
            const meterUrl = await marketingService.uploadVisitPhoto(meterPhoto, 'meters');

            // 2. Insert Report
            await marketingService.submitVisitReport({
                enterprise_name: enterpriseName,
                selfie_url: selfieUrl,
                meter_photo_url: meterUrl,
                visit_time: new Date().toISOString()
            });

            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting visit report:', error);
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className={styles.successView}>
                <div className={styles.successIconBox}>
                    <CheckCircle size={64} />
                </div>
                <h2>Submission Successful!</h2>
                <p>Your field visit report has been recorded.</p>
                <button
                    className={styles.resetBtn}
                    onClick={() => {
                        setSubmitted(false);
                        setEnterpriseName('');
                        setSelfie(null);
                        setMeterPhoto(null);
                        setPreviews({ selfie: null, meter: null });
                    }}
                >
                    Submit New Report
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Field Visit Entry</h1>
                <p>Record your visit details with photo proof</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.card}>
                <div className={styles.formGroup}>
                    <label>
                        <Store size={18} />
                        Shop / Enterprise Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Enterprise Name"
                        value={enterpriseName}
                        onChange={(e) => setEnterpriseName(e.target.value)}
                        className={styles.textInput}
                        required
                    />
                </div>

                <div className={styles.photoSection}>
                    <label className={styles.photoLabel}>
                        <ImageIcon size={18} />
                        Required Photo Proofs
                    </label>

                    <div className={styles.photoGrid}>
                        {/* Selfie Upload */}
                        <div className={styles.photoBox}>
                            <input
                                type="file"
                                id="selfie-upload"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'selfie')}
                                hidden
                            />
                            <label htmlFor="selfie-upload" className={`${styles.photoTile} ${previews.selfie ? styles.hasPhoto : ''}`}>
                                {previews.selfie ? (
                                    <img src={previews.selfie} alt="Selfie" />
                                ) : (
                                    <div className={styles.placeholder}>
                                        <Camera size={32} />
                                        <span>Upload Selfie</span>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Meter Photo Upload */}
                        <div className={styles.photoBox}>
                            <input
                                type="file"
                                id="meter-upload"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'meter')}
                                hidden
                            />
                            <label htmlFor="meter-upload" className={`${styles.photoTile} ${previews.meter ? styles.hasPhoto : ''}`}>
                                {previews.meter ? (
                                    <img src={previews.meter} alt="Meter" />
                                ) : (
                                    <div className={styles.placeholder}>
                                        <Camera size={32} />
                                        <span>Meter Photo</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className={styles.spin} />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload size={20} />
                            Submit Report
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default FieldVisit;
