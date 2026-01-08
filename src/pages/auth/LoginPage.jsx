import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import styles from './Auth.module.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login, user, profile } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && profile) {
            const role = profile.role || '';
            if (role.toLowerCase().includes('employee')) navigate('/employee/dashboard');
            else if (role.toLowerCase().includes('marketing')) navigate('/marketing/dashboard');
            else if (role.toLowerCase().includes('production')) navigate('/production/dashboard');
            else if (role.toLowerCase().includes('owner')) navigate('/owner/dashboard');
            else navigate('/profile');
        }
    }, [user, profile, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await login(email, password);
            if (error) throw error;
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Welcome Back!</h1>
                <p>Login to access your dashboard</p>
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
                    placeholder="Enter your password"
                    required
                />

                <Button type="submit" loading={loading} className="w-full">
                    Log In
                </Button>
            </form>

            <div className={styles.footer}>
                <p>
                    Don't have an account?{' '}
                    <Link to="/signup" className={styles.link}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
