import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import React, { useState } from 'react'
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        const signupPayload = {
            username: username,
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname
        }

        try {
            const response = await Register(signupPayload);
            console.log("respose 2 : ", response)
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    return (
        <Container>
            <Row className='justify-content-center min-vh-100 align-content-center'>
                <Col xl={5} lg={6} md={10} sm={12}>
                    <STCard>
                        <div className='mb-5 d-flex justify-content-center'>
                            <StaticImage src='../../images/logo.svg' alt='logo' />
                        </div>
                        <Form>
                            <Form.Group className='mb-3'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter your email" value={email} onChange={event => setEmail(event.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="email" placeholder="Enter your username" value={username} onChange={event => setUsername(event.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>First name</Form.Label>
                                <Form.Control type="email" placeholder="Enter your firstname" value={firstname} onChange={event => setFirstname(event.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Last name</Form.Label>
                                <Form.Control type="email" placeholder="Enter your lastname" value={lastname} onChange={event => setLastname(event.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password" value={password} onChange={event => setPassword(event.target.value)} />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Confirm password</Form.Label>
                                <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
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