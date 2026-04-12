import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message on new attempt
        
        try {
            // Sends request to your backend Auth route
            const res = await axios.post('http://localhost:5000/api/auth/login', { 
                email, 
                password 
            });
            
            console.log("Login successful!", res.data);
            
            // 1. Save critical info to localStorage
            localStorage.setItem('token', res.data.token);
            if (res.data.user) {
                localStorage.setItem('username', res.data.user.username);
            }
            
            // 2. Redirect the Comrade to the Dashboard
            navigate('/dashboard'); 
        } catch (err) {
            // Displays the specific error from backend (e.g., "Invalid Credentials")
            setError(err.response?.data?.message || "Login failed. Please try again.");
            console.error("Login Error:", err);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ color: '#005a32', marginBottom: '5px' }}>ComradeWallet</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>Login to manage your finances</p>
                
                {/* Error Box */}
                {error && (
                    <div style={styles.errorBox}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={styles.form}>
                    <input 
                        type="email" 
                        placeholder="Email (e.g. binkou@dekut.ac.ke)" 
                        style={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        style={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    <button type="submit" style={styles.button}>
                        Login
                    </button>
                </form>
                
                <p style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
                    Don't have an account? <span style={{ color: '#005a32', cursor: 'pointer', fontWeight: 'bold' }}>Register here</span>
                </p>
            </div>
        </div>
    );
};

// Professional Styles
const styles = {
    container: {
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#f4f7f6'
    },
    card: {
        background: 'white', 
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
        textAlign: 'center',
        width: '90%',
        maxWidth: '400px'
    },
    errorBox: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        fontSize: '14px',
        border: '1px solid #ef9a9a'
    },
    form: {
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px'
    },
    input: {
        padding: '12px 15px', 
        borderRadius: '8px', 
        border: '1px solid #ddd',
        fontSize: '16px',
        outlineColor: '#005a32'
    },
    button: {
        padding: '12px', 
        background: '#005a32', 
        color: 'white', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: '0.3s'
    }
};

export default Login;