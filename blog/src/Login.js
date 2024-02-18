import React, { useState } from 'react';
import './Login.scss';
import Authenticationimage from './images/Authentication.jpg';
import { Link,useNavigate } from 'react-router-dom'; // Change here
// import axiosInstance from './axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
 
 

//   const handleLogin = async () => {
//     try {
//       const response = await axiosInstance.post('/Login', { email, password });

//       if (response.status === 200) {
//         const token = response.data.token;
//         console.log('Token:', token);
//         // Save the token to local storage
//         localStorage.setItem('token', token);
  
//         toast.success('Login successful!', {
//           onClose: () => {
//             // Navigate to /HomePage after the toast is closed
//             navigate('/HomePage');
//           },
//         });
//       }else {
//         toast.error('Invalid email or password', {
//           theme: "colored",
//           });
//         // alert('Invalid email or password');
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       toast.error('Invalid email or password', {
//         theme: "colored",
//         });
//       // alert('Login unsuccessful');
//     }
//   };

  const validatePassword = () => {
    if (password.length < 8) {
      toast.error('Password must contain at least 8 characters.', {
        theme: "colored",
        });
      // alert('Password must contain at least 8 characters.');
      return false;
    }

    // Count characters in the password.
    let countUpperCase = 0;
    let countLowerCase = 0;
    let countDigit = 0;
    let countSpecialCharacters = 0;

    for (let i = 0; i < password.length; i++) {
      const specialChars = [
        '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', 
        '+', '=', '[', '{', ']', '}', ':', ';', '<', '>', 
      ];

      if (specialChars.includes(password[i])) {
        countSpecialCharacters++;
      } else if (!isNaN(password[i] * 1)) {
        countDigit++;
      } else {
        if (password[i] === password[i].toUpperCase()) {
          countUpperCase++;
        }
        if (password[i] === password[i].toLowerCase()) {
          countLowerCase++;
        }
      }
    }

    if (countLowerCase === 0 || countUpperCase === 0 || countDigit === 0 || countSpecialCharacters === 0) {
      toast.error('Password must contain at least one lowercase, one uppercase, one digit, and one special character.', {
        theme: "colored",
        });
      // alert('Password must contain at least one lowercase, one uppercase, one digit, and one special character.');
      return false;
    }

    return true;
  };

  const validateForm = () => {
    // Check if the Email field is filled.
    if (email.length === 0) {
      toast.error('Email Address cannot be empty', {
        theme: "colored",
        });
      // alert('Email Address cannot be empty');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address', {
        theme: "colored",
        });
      // alert('Please enter a valid email address');
      return;
    }

    // Validate the password
    if (validatePassword()) {
      // alert('Form is valid');
    //   handleLogin();
    }
  }

  return (
    <section className='image-container'>
      {/* Section for the image and header */}
      <section className="image">
        <h3 className="quote">Effortlessly track and<br /> manage your expense</h3>
        {/* Display the Image */}
        <img src={Authenticationimage} alt="exp" className="image" />
      </section>
      {/* Section for the form */}
      <section className='Authentication-page'>
        <section className='login-form'>
          <section className='form-input'>
            {/* Input field for Email */}
            <input
              type='email'
              placeholder='E-mail'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Input field for Password */}
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Login button */}
            <button type="submit" onClick={validateForm}>Login</button>
            <Link to="/ResetPassword"><span className="account">Forgot Password?</span> </Link>
            <Link to="/signup">
              Don't have an account? <span className="click-here">Click here</span>
            </Link>
          </section>
        </section>
      </section>

     
    </section>
  );
};

export default Login;