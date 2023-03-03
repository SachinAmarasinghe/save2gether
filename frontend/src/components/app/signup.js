import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import STCard from '../../components/stcard'
import { Signup as Register } from '../../services/api';

const Signup = () => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({});
    const [isTouched, setIsTouched] = useState(false);

    // validation 
    const validateEmail = () => {
        if (!email) {
            setErrors(errors => ({ ...errors, email: 'Email is required' }));
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrors(errors => ({ ...errors, email: 'Invalid email format' }));
        } else {
            setErrors(errors => ({ ...errors, email: null }));
        }
    };

    const validateUsername = () => {
        if (!username) {
            setErrors(errors => ({ ...errors, username: 'Username is required' }));
        } else {
            setErrors(errors => ({ ...errors, username: null }));
        }
    };

    const validateName = (name, fieldName) => {
        if (!name) {
            setErrors(errors => ({ ...errors, [fieldName]: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` }));
        } else {
            setErrors(errors => ({ ...errors, [fieldName]: null }));
        }
    };

    const validatePassword = () => {
        if (!password) {
            setErrors(errors => ({ ...errors, password: 'Password is required' }));
        } else if (password.length < 8) {
            setErrors(errors => ({ ...errors, password: 'Password must be at least 8 characters long' }));
        } else {
            setErrors(errors => ({ ...errors, password: null }));
        }
    };

    const validateConfirmPassword = () => {
        if (confirmPassword !== password) {
            setErrors(errors => ({ ...errors, confirmPassword: 'Passwords do not match' }));
        } else {
            setErrors(errors => ({ ...errors, confirmPassword: null }));
        }
    };

    useEffect(() => {
        validateEmail();
    }, [email]);

    useEffect(() => {
        validateUsername();
    }, [username]);

    useEffect(() => {
        validateName(firstname, 'firstname');
    }, [firstname]);

    useEffect(() => {
        validateName(lastname, 'lastname');
    }, [lastname]);

    useEffect(() => {
        validatePassword();
    }, [password]);

    useEffect(() => {
        validateConfirmPassword();
    }, [confirmPassword]);

    useEffect(() => {
        if (email || username || firstname || lastname || password || confirmPassword) {
            setIsTouched(true);
        }
    }, [email, username, firstname, lastname, password, confirmPassword]);

    // Form submit logic 
    const handleSubmit = async (e) => {
        e.preventDefault()

        validateEmail();
        validateUsername();
        validateName(firstname, 'firstname');
        validateName(lastname, 'lastname');
        validatePassword();
        validateConfirmPassword();

        const signupPayload = {
            username: username,
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname
        }

        if (Object.values(errors).every(error => !error)) {
            try {
                const response = await Register(signupPayload);
                console.log("respose : ", response)
            } catch (error) {
                console.log("Error: ", error);
            }
        }
    }

    return (
        <Container>
            <Row className='justify-content-center min-vh-100 align-content-center'>
                <Col xl={5} lg={6} md={10} sm={12}>
                    <STCard>
                        <div className='mb-5 d-flex justify-content-center'>
                            <StaticImage src='./images/logo.svg' alt='logo' layout="fixed" />
                        </div>
                        <Form>
                            <Form.Group className='mb-3'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control isInvalid={isTouched && errors.email} type="email" placeholder="Enter your email" value={email} onChange={event => setEmail(event.target.value)}>
                                </Form.Control>
                                {isTouched && errors.email && <Form.Text className='error'>{errors.email}</Form.Text>}
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="email" isInvalid={isTouched && errors.username} placeholder="Enter your username" value={username} onChange={event => setUsername(event.target.value)}>
                                </Form.Control>
                                {isTouched && errors.username && <Form.Text className='error'>{errors.username}</Form.Text>}
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>First name</Form.Label>
                                <Form.Control isInvalid={isTouched && errors.firstname} type="email" placeholder="Enter your firstname" value={firstname} onChange={event => setFirstname(event.target.value)}>
                                </Form.Control>
                                {isTouched && errors.firstname && <Form.Text className='error'>{errors.firstname}</Form.Text>}
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Last name</Form.Label>
                                <Form.Control isInvalid={isTouched && errors.lastname} type="email" placeholder="Enter your lastname" value={lastname} onChange={event => setLastname(event.target.value)}>
                                </Form.Control>
                                {isTouched && errors.lastname && <Form.Text className='error'>{errors.lastname}</Form.Text>}
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control isInvalid={isTouched && errors.password} type="password" placeholder="Enter password" value={password} onChange={event => setPassword(event.target.value)} />
                                {isTouched && errors.password && <Form.Text className='error'>{errors.password}</Form.Text>}
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Confirm password</Form.Label>
                                <Form.Control isInvalid={isTouched && errors.confirmPassword} type="password" placeholder="Confirm password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
                                {isTouched && errors.confirmPassword && <Form.Text className='error'>{errors.confirmPassword}</Form.Text>}
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit" className='mb-3' onClick={handleSubmit}>
                                    Signup
                                </Button>
                                <Link className='text-center' to='/app/signin'>Already have an account? Signin</Link>
                            </div>
                        </Form>
                    </STCard>
                </Col>
            </Row>
        </Container>
    )
}

export default Signup;