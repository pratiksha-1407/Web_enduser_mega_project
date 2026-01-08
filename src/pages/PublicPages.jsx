// Landing Page
export const LandingPage = () => (
    <div className="text-center">
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-blue)', marginBottom: '1rem' }}>Welcome to Mega Feeds</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Enterprise Management System</p>
        <a href="/login" style={{
            background: 'var(--primary-blue)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 'bold'
        }}>Login to Continue</a>
    </div>
);

// Login Page
export const LoginPage = () => {
    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>Login</h2>
            <p>Login Form Placeholder</p>
            {/* Actual form to be implemented in Step 4 */}
        </div>
    );
};

// Signup Page
export const SignupPage = () => (
    <div>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>Create Account</h2>
        <p>Signup Form Placeholder</p>
    </div>
);
