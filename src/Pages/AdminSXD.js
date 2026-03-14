import React, { useState } from 'react';
import DataPassword from "../Data/Admin.json";
import { useNavigate } from 'react-router-dom';

const AdminSXD = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setIsAuthenticating(true);
        setStatus('VERIFYING CREDENTIALS...');

        setTimeout(() => {
            const foundAdmin = DataPassword.admins.find(
                admin => admin.id === id && admin.password === password
            );

            if (foundAdmin) {
                setStatus('✅ ACCESS GRANTED. DECRYPTING DATA...');
                localStorage.setItem('user', JSON.stringify({ role: foundAdmin.role, name: foundAdmin.adminTitle }));
                setTimeout(() => {
                    navigate('/admin-movie');
                }, 1500);
            } else {
                setStatus('❌ ACCESS DENIED. INTRUSION LOGGED.');
                setIsAuthenticating(false);
            }
        }, 1500);
    }

    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#030712',
            color: '#10b981',
            fontFamily: '"Courier New", Courier, monospace',
            overflow: 'hidden'
        }}>
            {/* CRT Scanline Effect */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 4px, 6px 100%',
                zIndex: 10,
                pointerEvents: 'none'
            }}></div>

            {/* Glowing Matrix Background */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: '800px', height: '800px',
                background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(3,7,18,0) 70%)',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
                pointerEvents: 'none'
            }}></div>

            <form onSubmit={handleLogin} style={{
                position: 'relative',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '50px',
                width: '420px',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.15), inset 0 0 20px rgba(16, 185, 129, 0.05)',
                backgroundColor: 'rgba(3, 7, 18, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <h2 style={{ 
                        margin: 0, 
                        letterSpacing: '8px', 
                        fontSize: '28px',
                        textShadow: '0 0 10px rgba(16, 185, 129, 0.8)',
                        animation: 'flicker 3s infinite alternate'
                    }}>SXD CORE</h2>
                    <p style={{ margin: '8px 0 0 0', fontSize: '11px', opacity: 0.6, letterSpacing: '2px' }}>RESTRICTED ACCESS ONLY</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', letterSpacing: '2px', opacity: 0.8 }}>[&gt;] ROOT_ID</label>
                    <input 
                        type="text" 
                        value={id} 
                        onChange={e => setId(e.target.value)} 
                        disabled={isAuthenticating}
                        style={{ 
                            background: 'rgba(16, 185, 129, 0.05)', 
                            border: '1px solid rgba(16, 185, 129, 0.3)', 
                            color: '#10b981', 
                            padding: '14px', 
                            outline: 'none',
                            fontFamily: 'inherit',
                            fontSize: '15px',
                            letterSpacing: '1px',
                            transition: 'all 0.3s'
                        }}
                        autoComplete="off"
                        spellCheck="false"
                        onFocus={e => e.target.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.3)'}
                        onBlur={e => e.target.style.boxShadow = 'none'}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', letterSpacing: '2px', opacity: 0.8 }}>[&gt;] SECRET_KEY</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        disabled={isAuthenticating}
                        style={{ 
                            background: 'rgba(16, 185, 129, 0.05)', 
                            border: '1px solid rgba(16, 185, 129, 0.3)', 
                            color: '#10b981', 
                            padding: '14px', 
                            outline: 'none',
                            fontFamily: 'inherit',
                            fontSize: '15px',
                            letterSpacing: '3px',
                            transition: 'all 0.3s'
                        }}
                        onFocus={e => e.target.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.3)'}
                        onBlur={e => e.target.style.boxShadow = 'none'}
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={isAuthenticating}
                    style={{ 
                        background: '#10b981', 
                        color: '#030712', 
                        border: 'none', 
                        padding: '14px', 
                        cursor: isAuthenticating ? 'wait' : 'pointer', 
                        fontWeight: 'bold',
                        fontFamily: 'inherit',
                        fontSize: '15px',
                        letterSpacing: '4px',
                        marginTop: '15px',
                        boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)',
                        transition: 'all 0.2s',
                        opacity: isAuthenticating ? 0.7 : 1
                    }}
                    onMouseOver={e => !isAuthenticating && (e.target.style.transform = 'scale(1.02)')}
                    onMouseOut={e => !isAuthenticating && (e.target.style.transform = 'scale(1)')}
                >
                    {isAuthenticating ? 'PROCESSING...' : 'INITIALIZE'}
                </button>

                {status && (
                    <div style={{ 
                        padding: '12px', 
                        marginTop: '5px', 
                        borderLeft: `3px solid ${status.includes('❌') ? '#ef4444' : '#10b981'}`,
                        background: 'rgba(0,0,0,0.4)',
                        fontSize: '13px',
                        letterSpacing: '1px'
                    }}>
                        <p style={{ 
                            margin: 0, 
                            color: status.includes('❌') ? '#ef4444' : '#10b981',
                            animation: 'typewriter 0.5s steps(40, end)'
                        }}>
                            {status}
                        </p>
                    </div>
                )}
            </form>

            <style>
                {`
                @keyframes flicker {
                    0% { opacity: 0.9; text-shadow: 0 0 10px rgba(16, 185, 129, 0.8); }
                    5% { opacity: 0.5; text-shadow: none; }
                    10% { opacity: 0.9; text-shadow: 0 0 10px rgba(16, 185, 129, 0.8); }
                    15% { opacity: 0.9; }
                    20% { opacity: 0.4; text-shadow: none; }
                    25% { opacity: 1; text-shadow: 0 0 15px rgba(16, 185, 129, 1); }
                    30% { opacity: 0.9; }
                    100% { opacity: 1; text-shadow: 0 0 10px rgba(16, 185, 129, 0.8); }
                }
                @keyframes typewriter {
                    from { width: 0; opacity: 0; }
                    to { width: 100%; opacity: 1; }
                }
                `}
            </style>
        </div>
    );
};

export default AdminSXD;
