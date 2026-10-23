import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_ORIGIN from '../config';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // Use the local API during development and the deployed API in production.
            await axios.post(`${API_ORIGIN}/api/auth/register`, {
                username,
                email, 
                password 
            });
            
            alert("Registration successful! Please login.");
            navigate('/login'); 
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
            console.error("Registration Error:", err);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ color: '#005a32', marginBottom: '5px' }}>Join ComradeWallet</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>Start managing your funds today</p>
                
                {error && (
                    <div style={styles.errorBox}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} style={styles.form}>
                    <input 
                        type="text" 
                        placeholder="Username (e.g. Binkou)" 
                        style={styles.input} 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
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
                        Register
                    </button>
                </form>

                <p style={{ marginTop: '25px', fontSize: '14px', color: '#555' }}>
                    Already have an account?{' '}
                    <span 
                        onClick={() => navigate('/login')} 
                        style={{ 
                            color: '#005a32', 
                            textDecoration: 'underline', 
                            fontWeight: 'bold', 
                            cursor: 'pointer',
                            padding: '10px 5px',
                            display: 'inline-block'
                        }}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

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

export default Register;
