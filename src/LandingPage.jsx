import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaArrowRight, FaUniversity, FaTimes, FaSpinner, FaBook, FaLaptopCode, FaMicrochip, FaHandHoldingHeart, FaUserAstronaut } from 'react-icons/fa';
import { supabase } from './supabaseClient';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [campus, setCampus] = useState('');
  const [email, setEmail] = useState('');
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [isSubmittingVolunteer, setIsSubmittingVolunteer] = useState(false);
  
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    campus: '',
    year: '',
    contribution: ''
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedCampus = localStorage.getItem('userCampus');
    if (savedEmail && savedCampus) {
      navigate('/dashboard', { state: { campus: savedCampus, email: savedEmail } });
    }
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    const { data, error } = await supabase.from('volunteers').select('*');
    if (!error) setVolunteers(data || []);
  };

  const handleEnter = (e) => {
    e.preventDefault();
    if (!campus || !email) {
      alert("Please select a campus and enter email.");
      return;
    }
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userCampus', campus);
    navigate('/dashboard', { state: { campus, email } });
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingVolunteer(true);
    try {
      const { error } = await supabase.from('volunteers').insert([volunteerForm]);
      if (error) throw error;
      alert("Thank you for volunteering! Your entry has been recorded.");
      setShowJoinModal(false);
      setVolunteerForm({ name: '', email: '', campus: '', year: '', contribution: '' });
      fetchVolunteers();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message + ". (Make sure the 'volunteers' table exists in Supabase)");
    } finally {
      setIsSubmittingVolunteer(false);
    }
  };

  return (
    <div className="landing-container">
      {/* Background Tech Elements */}
      <div className="bg-shapes">
        <div className="tech-grid"></div>
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <motion.div className="floating-element" style={{ top: '20%', left: '10%' }} animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6 }}>
          <FaBook />
        </motion.div>
        <motion.div className="floating-element" style={{ bottom: '20%', right: '15%' }} animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 8 }}>
          <FaLaptopCode />
        </motion.div>
        <motion.div className="floating-element" style={{ top: '40%', right: '10%' }} animate={{ y: [0, -15, 0], rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 7 }}>
          <FaMicrochip />
        </motion.div>
      </div>

      <nav className="navbar">
        <div className="logo-container">
          <FaUniversity className="logo-icon" />
          <span className="logo-text">NST Magazine</span>
        </div>
        <div className="nav-links">
          <a href="#">About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setShowVolunteers(true); }}>Volunteers</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin'); }}>Admin</a>
        </div>
      </nav>

      <main className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="badge">
            <FaGraduationCap />
            <span>The New-Age Tech Magazine</span>
          </div>
          <h1 className="hero-title">
            Newton School <br /> of Technology
          </h1>
          <p className="hero-subtitle">
             Exploring the frontiers of technology and innovation. The official voice of NST across all campuses.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
                <motion.form 
                  key="login-form"
                  className="signup-card" 
                  onSubmit={handleEnter}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <h3 style={{ marginTop: 0 }}>Join the Network</h3>
                  <p>Select your campus and provide details to enter.</p>
                  
                  <div className="form-group">
                    <label>Select Campus</label>
                    <div className="campus-options">
                      {['RU', 'SVyasa', 'ADYPU'].map(c => (
                        <button 
                          key={c}
                          type="button" 
                          className={`campus-btn ${campus === c ? 'active' : ''}`}
                          onClick={() => setCampus(c)}
                        >{c}</button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <input 
                      type="email" 
                      placeholder="Student Email Address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="cta-btn">
                    Enter Dashboard <FaArrowRight />
                  </button>

                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button type="button" className="secondary-btn" style={{ width: '100%' }} onClick={() => setShowJoinModal(true)}>
                      <FaHandHoldingHeart style={{ marginRight: '8px' }} /> Become a Volunteer
                    </button>
                  </div>
                </motion.form>
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* Volunteers List Modal */}
      {showVolunteers && (
        <div className="modal-overlay" onClick={() => setShowVolunteers(false)}>
          <motion.div className="modal-content" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <button className="close-btn" onClick={() => setShowVolunteers(false)}><FaTimes /></button>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaUserAstronaut style={{ color: 'var(--nst-blue-light)' }} /> Our Volunteers
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>The brilliant minds helping us create this magazine.</p>
            <div className="volunteer-list">
              {volunteers.length > 0 ? volunteers.map((v, i) => (
                <div key={i} className="volunteer-card">
                  <div style={{ width: '40px', height: '40px', background: 'var(--nst-blue-light)', borderRadius: '50%', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold' }}>
                    {v.name[0]}
                  </div>
                  <h4>{v.name}</h4>
                  <p>{v.campus} • {v.year} Yr</p>
                </div>
              )) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No volunteers yet. Be the first!
                </div>
              )}
            </div>
            <button className="cta-btn" style={{ marginTop: '2rem' }} onClick={() => { setShowVolunteers(false); setShowJoinModal(true); }}>
              Join them now
            </button>
          </motion.div>
        </div>
      )}

      {/* Become Volunteer Modal */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <motion.div className="modal-content" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <button className="close-btn" onClick={() => setShowJoinModal(false)}><FaTimes /></button>
            <h2>Become a Volunteer</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Help us grow the NST Magazine community.</p>
            
            <form onSubmit={handleVolunteerSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" value={volunteerForm.name} onChange={e => setVolunteerForm({...volunteerForm, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Email ID</label>
                <input type="email" placeholder="john@student.nst.edu" value={volunteerForm.email} onChange={e => setVolunteerForm({...volunteerForm, email: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Campus</label>
                  <select value={volunteerForm.campus} onChange={e => setVolunteerForm({...volunteerForm, campus: e.target.value})} required>
                    <option value="">Select</option>
                    <option value="RU">RU</option>
                    <option value="SVyasa">SVyasa</option>
                    <option value="ADYPU">ADYPU</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Year</label>
                  <select value={volunteerForm.year} onChange={e => setVolunteerForm({...volunteerForm, year: e.target.value})} required>
                    <option value="">Select</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>How can you contribute?</label>
                <textarea placeholder="e.g. Content Writing, Design, Social Media..." value={volunteerForm.contribution} onChange={e => setVolunteerForm({...volunteerForm, contribution: e.target.value})} rows="3" required></textarea>
              </div>
              
              <button type="submit" className="cta-btn" disabled={isSubmittingVolunteer}>
                {isSubmittingVolunteer ? <FaSpinner className="icon-spin" /> : 'Apply to Volunteer'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
