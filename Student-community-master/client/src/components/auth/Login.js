import React, { useState, useRef, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login, googleLogin } from '../../actions/auth';
const Login = ({ googleLogin, login, isAuthenticated }) => {
  const googleButtonRef = useRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  useEffect(() => {
    const handleGoogleLogin = (googleData) => {
      googleLogin(googleData.credential, navigate);
    };
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id:
          '780728498832-ibhlqf45e7qeo5gcpt5tr6ja9qrae9cu.apps.googleusercontent.com',
        callback: handleGoogleLogin
      });
      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        { size: 'large', theme: 'filled_blue' } // customization attributes
      );
    }
  });
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <section className="landing-2">
    <section className="container">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Sign Into Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
          />
        </div>
        <input
          type="submit"
          className="btn btn-primary"
          value="Login Manually"
        />
      </form>
      <button className="google-login-btn" ref={googleButtonRef}></button>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
    </section>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login, googleLogin })(Login);
