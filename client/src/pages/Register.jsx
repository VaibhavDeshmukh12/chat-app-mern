/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { registerRoute } from '../utils/ApiRoutes';

const Register = () => {

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const navigate = useNavigate();

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 4000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    }

    useEffect(() => {
        if (localStorage.getItem("chat-app-user")) {
            navigate("/");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            // console.log("in validation",registerRoute);
            const { password, username, email } = values;
            const { data } = await axios.post(registerRoute, {
                username, email, password
            });
            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
                localStorage.setItem("chat-app-user", JSON.stringify(data.user));
            }
            navigate('/');
        }
    }

    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;
        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password should be same.",
                toastOptions
            );
            return false;
        }
        else if (username.length < 3) {
            toast.error("Username should be greater than 3 characters.",
                toastOptions
            );
            return false;
        }
        else if (password.length < 6) {
            toast.error("Password should be equa or greater than 6 characters.",
                toastOptions
            );
            return false;
        }
        else if (email === "") {
            toast.error("Email is required", toastOptions);
            return false;
        }
        return true;
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    return (
        <>
            <FormContainer>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className='brand'>
                        <img src={Logo} alt="Logo" />
                        <h1>Snappy</h1>
                    </div>
                    <input
                        type="text"
                        name="username"
                        placeholder='Username'
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder='Email'
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder='Password'
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder='Confirm Password'
                        onChange={(e) => handleChange(e)}
                    />
                    <button type='submit'>Create User</button>
                    <span>
                        Already have an accout ?
                        <Link to={'/login'} > Login</Link>
                    </span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    )
}

const FormContainer = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #131324;
.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  img {
    height: 5rem;
  }
  h1 {
    color: white;
    text-transform: uppercase;
  }
}

form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: #00000076;
  border-radius: 2rem;
  padding: 3rem 5rem;
}
input {
  background-color: transparent;
  padding: 1rem;
  border: 0.1rem solid #4e0eff;
  border-radius: 0.4rem;
  color: white;
  width: 100%;
  font-size: 1rem;
  &:focus {
    border: 0.1rem solid #997af0;
    outline: none;
  }
}
button {
  background-color: #4a2f97;
  color: white;
  padding: 1rem 2rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1rem;
  text-transform: uppercase;
  transition:.5s ease-in-out;
  &:hover {
    background-color: #4e0eff;
  }
}
span {
  color: white;
  text-transform: uppercase;
  a {
    color: #4e0eff;
    text-decoration: none;
    font-weight: bold;
  }
}
`;

export default Register
