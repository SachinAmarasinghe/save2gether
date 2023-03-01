import React, { useState } from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import STCard from '../../components/stcard';
import { Signin as Login } from '../../services/api';

const { Container, Row, Col, Form, Button } = require("react-bootstrap")

const Signin = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        const signinPayload = {
            identifier: email,
            password: password
        }

        try {
            const response = await Login(signinPayload);
            console.log("Signin response : ", response)
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
                                <Form.Label>Username/Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter your username/email" value={email} onChange={event => setEmail(event.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={event => setPassword(event.target.value)} />
                                <Form.Text className="text-muted">
                                    <Link to='/forgotPassword'>Forgot password?</Link>
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Check type="checkbox" label="Remember me" />
                            </Form.Group>
                            <div className="d-grid gap-2">
                                <Button variant="primary" onClick={handleSubmit} className='mb-3'>
                                    Signin
                                </Button>
                                <Link className='text-center' to='/app/signup'>Don't have an account? Signup</Link>
                            </div>
                        </Form>
                    </STCard>
                </Col>
            </Row>
        </Container>
    )
}

export default Signin