import { useEffect, useRef, useState } from 'react';
import DesktopBG from "../Asstes/DesktopBG.svg";
import TableBG from "../Asstes/TableBG.svg";
import MobileBG from "../Asstes/MobileBG.svg";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import '../Style/Login.css';

const Login = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Forms states
  const [isLoginView, setIsLoginView] = useState(true);

  // Login State
  const [loginInput, setLoginInput] = useState(''); // Email, Tel, or ID
  const [loginPassword, setLoginPassword] = useState('');

  // Registration States
  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [generatedId, setGeneratedId] = useState('');

  // 15% SXD Modal State
  const [showSxdModal, setShowSxdModal] = useState(false);
  const [sxdPhone, setSxdPhone] = useState('');
  const [sxdPassword, setSxdPassword] = useState('');
  const [sxdGeneratedCode, setSxdGeneratedCode] = useState('');

  // UI states
  const [status, setStatus] = useState('');
  const [modalStatus, setModalStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Set Background Image
  useEffect(() => {
    if (!containerRef.current) return;

    const updateBackground = () => {
      const width = window.innerWidth;
      let bg;
      if (width <= 600) bg = MobileBG;
      else if (width <= 1024) bg = TableBG;
      else bg = DesktopBG;

      if (containerRef.current) {
        containerRef.current.style.backgroundImage = `url(${bg})`;
      }
    };

    updateBackground();
    window.addEventListener('resize', updateBackground);
    return () => window.removeEventListener('resize', updateBackground);
  }, []);

  const switchView = () => {
    setStatus('');
    setIsLoginView(!isLoginView);
  };

  const handleLogin = async () => {
    if (!loginInput || !loginPassword) {
      setStatus('Iltimos barcha maydonlarni to‘ldiring');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginInput, password: loginPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`✅ Xush kelibsiz!`);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => { navigate('/'); window.location.reload(); }, 1500);
      } else {
        setStatus(data.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      setStatus('Server bilan bog‘lanishda xatolik');
    }
  };

  const handleRegister = async () => {
    if (!regName || !regSurname || !regEmail || !regPhone || !regPassword) {
      setStatus('Barcha qatorlarni to‘ldiring');
      return;
    }

    // Password validation: min 5 letters and min 2 numbers
    const lettersCount = (regPassword.match(/[a-zA-Z]/g) || []).length;
    const numbersCount = (regPassword.match(/[0-9]/g) || []).length;
    
    if (lettersCount < 5 || numbersCount < 2) {
      setStatus('Parolda kamida 5 ta harf va kamida 2 ta son bo\'lishi kerak');
      return;
    }

    const newId = 'ID-' + Math.floor(100000 + Math.random() * 900000);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: newId, 
          name: regName, 
          surname: regSurname, 
          email: regEmail, 
          phone: regPhone, 
          password: regPassword 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedId(newId);
        setStatus(`Muvaffaqiyatli! ID: ${newId}`);
        setTimeout(() => {
          setLoginInput(newId);
          setStatus('');
          setIsLoginView(true);
        }, 4000);
      } else {
        setStatus(data.message || 'Ro‘yxatdan o‘tishda xatolik');
      }
    } catch (err) {
      setStatus('Server bilan bog‘lanishda xatolik');
    }
  };

  // Google Login Hook
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // Decode or mock fetch UI
      localStorage.setItem('user', JSON.stringify({ role: 'client', name: 'Google Foydalanuvchi' }));
      setStatus(`✅ Google orqali ulandi`);
      setTimeout(() => { navigate('/'); window.location.reload(); }, 1000);
    },
    onError: () => setStatus('Google orqali kirishda xatolik')
  });

  const handlePhoneFormat = (e) => {
    let input = e.target.value;

    // Remove "+998 " from the beginning so we can process just the 9 digits
    if (input.startsWith('+998 ')) {
      input = input.substring(5);
    } else if (input.startsWith('998')) {
      input = input.substring(3);
    }

    input = input.replace(/\D/g, ''); // Remove all non-digits
    
    if (input.length > 9) input = input.substring(0, 9);

    let formatted = '+998 ';
    if (input.length > 0) formatted += '(' + input.substring(0, 2);
    if (input.length >= 3) formatted += ')' + input.substring(2, 5);
    if (input.length >= 6) formatted += '-' + input.substring(5, 7);
    if (input.length >= 8) formatted += '-' + input.substring(7, 9);
    
    // If the input is completely empty after typing backspace on +998, just clear it
    if (input.length === 0 && e.target.value.length < 5) {
        setSxdPhone('');
        return;
    }

    setSxdPhone(formatted);
  };

  const handleRegPhoneFormat = (e) => {
    let input = e.target.value;

    if (input.startsWith('+998 ')) {
      input = input.substring(5);
    } else if (input.startsWith('998')) {
      input = input.substring(3);
    }

    input = input.replace(/\D/g, ''); 
    
    if (input.length > 9) input = input.substring(0, 9);

    let formatted = '+998 ';
    if (input.length > 0) formatted += '(' + input.substring(0, 2);
    if (input.length >= 3) formatted += ')' + input.substring(2, 5);
    if (input.length >= 6) formatted += '-' + input.substring(5, 7);
    if (input.length >= 8) formatted += '-' + input.substring(7, 9);

    if (input.length === 0 && e.target.value.length < 5) {
        setRegPhone('');
        return;
    }

    setRegPhone(formatted);
  };

  const createSxdAccount = () => {
    if (sxdPhone.length < 13 || !sxdPassword) {
      setModalStatus('Telefonni to\'liq yozing va parolni kiriting');
      return;
    }

    // Generate strict Alphanumeric mix code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setSxdGeneratedCode(code);

    const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    storedUsers.push({ sxdCode: code, phone: sxdPhone, password: sxdPassword });
    localStorage.setItem('mockUsers', JSON.stringify(storedUsers));

    setModalStatus(`Muvaffaqiyatli yaratildi! Kod: ${code}`);

    setTimeout(() => {
      setLoginInput(code);
      setLoginPassword('');
      setShowSxdModal(false);
      setIsLoginView(true);
      setModalStatus('');
    }, 5000);
  };

  return (
    <div className="login-wrapper" ref={containerRef}>
      {/* Animated Glowing Orbs for Premium Effect */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <div className="login-container">

        <div className='login-header-main'>
          <h2>{isLoginView ? 'Xush kelibsiz' : "Ro'yxatdan o'tish"}</h2>
          {generatedId && !isLoginView ? (
            <div className="generated-id-box">
              <p>Sizning Maxsus ID raqamingiz</p>
              <h4>{generatedId}</h4>
            </div>
          ) : (
            <p>{isLoginView ? "Davom etish uchun tizimga kiring" : "SXD tizimiga ulanish uchun ma'lumot qoldiring"}</p>
          )}
        </div>

        <div className='login-form'>

          {isLoginView ? (
            // --- LOGIN FORM ---
            <>
              <div className='input-group'>
                <i className="fa-solid fa-user input-icon"></i>
                <input
                  type='text'
                  placeholder="Email, Tel yoki ID"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  spellCheck="false"
                />
              </div>

              <div className='input-group'>
                <i className="fa-solid fa-lock input-icon"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Parol"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <div onClick={() => setShowPassword(!showPassword)} className='eye-toggle'>
                  <i className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                </div>
              </div>

              <div className='login-actions'>
                <button className='main-login-btn' onClick={handleLogin}>Kirish</button>
                <p className={`status-msg ${status.startsWith('✅') ? 'success' : 'error'}`}>{status}</p>
              </div>

              <p className="toggle-form-text" style={{ fontSize: '15px', marginTop: '20px' }}>
                Akkauntingiz yo'qmi? <span onClick={switchView} style={{ color: '#F43F5E', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>Yangi hisob yaratish</span>
              </p>

              <div className='divider'>
                <span>yoki</span>
              </div>

              {/* Icon-only Social Logins */}
              <div className='social-icons-row'>
                <button className="social-icon-btn google" onClick={() => loginWithGoogle()}>
                  <i className="fa-brands fa-google"></i>
                </button>
                <button className="social-icon-btn telegram" onClick={() => window.open(`https://t.me/Anivocom_bot`, '_blank')}>
                  <i className="fa-brands fa-telegram"></i>
                </button>
                {/* SXD 15% Trigger Button */}
                <button className="social-icon-btn sxd" onClick={() => setShowSxdModal(true)}>
                  <i className="fa-solid fa-key"></i>
                </button>
              </div>
            </>
          ) : (
            // --- REGISTER FORM (Scrollable if needed inside 90vh) ---
            <>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className='input-group' style={{ flex: 1 }}>
                  <i className="fa-solid fa-signature input-icon"></i>
                  <input
                    type='text'
                    placeholder="Ism"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>
                <div className='input-group' style={{ flex: 1 }}>
                  <input
                    type='text'
                    placeholder="Familya"
                    value={regSurname}
                    onChange={(e) => setRegSurname(e.target.value)}
                    style={{ paddingLeft: '15px' }}
                  />
                </div>
              </div>

              <div className='input-group'>
                <i className="fa-solid fa-envelope input-icon"></i>
                <input
                  type='email'
                  placeholder="Email manzil"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>

              <div className='input-group'>
                <i className="fa-solid fa-phone input-icon"></i>
                  <input
                    type='tel'
                    placeholder="+998 (__)___-__-__"
                    value={regPhone}
                    onChange={handleRegPhoneFormat}
                  />
              </div>

              <div className='input-group'>
                <i className="fa-solid fa-key input-icon"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Doimiy parol o'rnating"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
                <div onClick={() => setShowPassword(!showPassword)} className='eye-toggle'>
                  <i className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                </div>
              </div>

              <div className='login-actions'>
                <button className='main-login-btn' onClick={handleRegister}>ID Olish</button>
                <p className={`status-msg ${status.startsWith('✅') ? 'success' : 'error'}`}>{status}</p>
              </div>

              <p className="toggle-form-text">
                Akkauntingiz bormi? <span onClick={switchView}>Kirish</span>
              </p>
            </>
          )}

        </div>
      </div>

      {/* ========== 15% SXD MODAL ========== */}
      {showSxdModal && (
        <div className='login-info-overlay'>
          <div className='login-info-card'>
            <button className='close-btn' onClick={() => setShowSxdModal(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className='card-content'>
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <i className="fa-solid fa-key" style={{ fontSize: '36px', color: '#F43F5E' }}></i>
              </div>
              <h3 style={{ color: '#F43F5E' }}>SXD HISOBI</h3>
              <p>Siz bizning <b>15% lik</b> hisob kirishidasiz. Raqamingizni tasdiqlang.</p>

              {sxdGeneratedCode ? (
                <div className="generated-id-box" style={{ marginTop: '15px' }}>
                  <p>Sizning SXD maxsus Kodingiz</p>
                  <h4 style={{ color: '#F43F5E', letterSpacing: '4px' }}>{sxdGeneratedCode}</h4>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                  <div className='input-group'>
                    <i className="fa-solid fa-phone input-icon"></i>
                    <input
                      type='text'
                      placeholder="+998 (__)___-__-__"
                      value={sxdPhone}
                      onChange={handlePhoneFormat}
                    />
                  </div>
                  <div className='input-group'>
                    <i className="fa-solid fa-lock input-icon"></i>
                    <input
                      type="password"
                      placeholder="Parol yarating"
                      value={sxdPassword}
                      onChange={(e) => setSxdPassword(e.target.value)}
                    />
                  </div>
                  <button className='main-login-btn sxd-btn' onClick={createSxdAccount}>
                    SXD Kod Yaratish
                  </button>
                </div>
              )}
              <p className={`status-msg ${modalStatus.startsWith('✅') ? 'success' : 'error'}`} style={{ marginTop: '10px' }}>{modalStatus}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;