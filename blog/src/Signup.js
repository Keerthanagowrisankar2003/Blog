import React, { useState } from 'react';
import './Signup.scss';
import Authenticationimage from './images/Authentication.jpg';
import axiosInstance from './axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link,useNavigate } from 'react-router-dom';

const Signup = () => {
  const [firstname, setFirstname] = useState(""); 
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const navigate = useNavigate();

  // Function to validate the input data when submit button is clicked.
  function validateForm() {
    // Check if the First Name is an Empty string or not.
    if (firstname.length === 0) {
      toast.error('First Name can not be empty', {
        theme: "colored",
        });
      // alert('First Name can not be empty');
      return;
    }

    // Check if the Email field is filled.
    if (email.length === 0) {
      toast.error('Email Address can not be empty', {
        theme: "colored",
        });
      // alert('Email Address can not be empty');
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

    // Check if password follows constraints or not.
    if (password.length < 8) {
      toast.error('Password must contain at least 8 characters.', {
        theme: "colored",
        });
      // alert('Password must contain at least 8 characters.');
      return;
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

    if (countLowerCase === 0) {
      toast.error('Invalid Form, 0 lowercase characters in password', {
        theme: "colored",
        });
      // alert('Invalid Form, 0 lowercase characters in password');
      return;
    }

    if (countUpperCase === 0) {
      toast.error('Invalid Form, 0 uppercase characters in password', {
        theme: "colored",
        });
      // alert('Invalid Form, 0 uppercase characters in password');
      return;
    }

    if (countDigit === 0) {
      toast.error('Invalid Form, 0 digit characters in password', {
        theme: "colored",
        });
      // alert('Invalid Form, 0 digit characters in password');
      return;
    }

    if (countSpecialCharacters === 0) {
      toast.error('Invalid Form, 0 special characters in password', {
        theme: "colored",
        });
      // alert('Invalid Form, 0 special characters in password');
      return;
    }

    {
      axiosInstance.post('/Signup/Signup', {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
      })
      .then(response => {
        console.log('Form data sent successfully:', response.data);
        toast.success('Signup successfull!', {
          theme: "light",
          onClose: () => {
            // Navigate to /HomePage after the toast is closed
            navigate('/', { replace: true });
          },
        });
      })
      .catch(error => {
        console.error('Error sending form data:', error);
        toast.error('Error sending form data', {
          theme: "colored",
          });
        // alert('Error sending form data',error);
      });
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
        <section className='Signup-page'>
          <section className='form'>
            <section className='form-input'>
              {/* Input field for First Name */}
              <input 
                type='text'
                placeholder='First Name'
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              {/* Input field for Last Name */}
              <input 
                type='text'
                placeholder='Last Name'
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
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
              {/* Signup button */}
              <button type="button" onClick={validateForm}>Submit</button>
              {/* Link for existing users */}
              <Link to="/">Already have an account? <span className="click-here">Click here</span></Link>
            </section>
          </section>
        </section>
      </section>
   
   
  );
}

export default Signup; 