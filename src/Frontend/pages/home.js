// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const Home = () => {
  const year = new Date().getFullYear();

  return (
    <div className="nf-site-wrapper">
      {/* HEADER */}
      <header className="nf-site-header">
        <div className="nf-site-logo">
          <div className="nf-logo-icon">N</div>
          <div className="nf-logo-text">
            <span className="nf-logo-main">NeuroFleetX</span>
            <span className="nf-logo-sub">AI Fleet & Traffic</span>
          </div>
        </div>

        <nav className="nf-site-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nf-site-actions">
          <Link to="/login" className="nf-btn-primary nf-login-btn">
            Login
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main>
        {/* HERO / HOME SECTION */}
        <section id="home" className="nf-home-page">
          <div className="nf-home-hero">
            <div className="nf-home-text">
              <h1>NeuroFleetX</h1>
              <p>
                An AI-powered urban fleet and traffic management platform that
                optimizes city mobility, reduces congestion and enhances road
                safety using intelligent analytics.
              </p>
              <div className="nf-home-actions">
                <Link to="/login" className="nf-btn-primary">
                  Get Started
                </Link>
                <Link to="/register" className="nf-btn-outline">
                  Register
                </Link>
              </div>
              <div className="nf-home-badges">
                <span>Real-time traffic insights</span>
                <span>Smart route optimization</span>
                <span>Role-based dashboards</span>
              </div>
            </div>

            <div className="nf-home-panel">
              <div className="nf-home-card">
                <h3>Live Fleet Snapshot</h3>
                <ul>
                  <li> 32 Vehicles active</li>
                  <li> 9 Trips in progress</li>
                  <li> Avg. delay: 3.2 mins</li>
                  <li> CO₂ saved today: 184 kg</li>
                </ul>
              </div>
              <div className="nf-home-card small">
                <h4>Traffic Hotspots</h4>
                <p>Central Business District · IT Corridor · City Ring Road</p>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="nf-about-section">
          <div className="nf-about-card">
            <h2>About NeuroFleetX</h2>
            <p>
              NeuroFleetX is designed as a smart city solution for managing
              fleets, drivers and customer trips in real time. It brings
              together advanced AI models, live traffic data and intuitive
              dashboards for different roles in the ecosystem.
            </p>
            <div className="nf-about-grid">
              <div className="nf-about-item">
                <h3>Admins</h3>
                <p>Monitor overall system usage, revenue and platform health.</p>
              </div>
              <div className="nf-about-item">
                <h3>Fleet Managers</h3>
                <p>
                  Track vehicles, drivers, active trips and optimize route
                  assignments.
                </p>
              </div>
              <div className="nf-about-item">
                <h3>Drivers</h3>
                <p>
                  View daily trips, earnings, performance and smart route
                  suggestions.
                </p>
              </div>
              <div className="nf-about-item">
                <h3>Customers</h3>
                <p>
                  Manage bookings, view trip history, spend and travel
                  preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="nf-contact-section">
          <div className="nf-contact-card">
            <h2>Contact</h2>
            <p className="nf-contact-text">
              This is an academic project prototype for demonstrating AI-based
              urban fleet and traffic management using a Java full-stack
              architecture with React frontend.
            </p>
            <div className="nf-contact-grid">
              <div>
                <h3>Project Name</h3>
                <p>NeuroFleetX – AI Powered Urban Fleet & Traffic Management</p>
              </div>
              <div>
                <h3>Get in touch</h3>
                <p>Email: demo@example.com</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="nf-site-footer">
        <div className="nf-footer-left">
          <span className="nf-footer-title">NeuroFleetX</span>
          <span className="nf-footer-sub">
            © {year} NeuroFleetX. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
