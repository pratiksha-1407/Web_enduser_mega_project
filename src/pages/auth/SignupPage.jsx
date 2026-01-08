import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import styles from './Auth.module.css';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await signup(email, password);
            if (error) throw error;
            // Show success message or redirect to login
            alert("Account created! Please ask admin to activate your profile.");
            // In a real app we might redirect or show a success state
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Create Account</h1>
                <p>Sign up to get started</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && (
                    <div className={styles.errorAlert}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <Input
                    label="Email"
                    type="email"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    icon={Lock}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    icon={Lock}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                />

                <Button type="submit" loading={loading} className="w-full">
                    Sign Up
                </Button>
            </form>

            <div className={styles.footer}>
                <p>
                    Already have an account?{' '}
                    <Link to="/login" className={styles.link}>Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
