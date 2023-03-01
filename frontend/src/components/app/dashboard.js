import { Link } from 'gatsby'
import React, { useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { GetAllBudgets } from '../../services/api'

const Dashboard = () => {
    const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null

    useEffect(() => {
        getBudgets()
    }, [])

    const getBudgets = async () => {
        let budgets = await GetAllBudgets();
        console.log("Budgets : ", budgets.data);
    }

    return (
        <Container>
            <Row className='justify-content-center min-vh-100 align-content-center'>
                <Col lg={8}>
                    <div className='d-flex flex-column align-items-center'>
                        <h1 className="display-4 text-center mb-5"><strong>Welcome to your personal Expense Tracker, {user.firstname}!</strong></h1>
                        <p className='text-center mb-5'>It looks like you haven't set a budget yet. No worries, simply create a new budget and start tracking your expenses. This Dashboard will help you keep your spending in check and give you a clear overview of your financial health. Let's get started!</p>
                        <Link className='btn btn-primary' to='/app/budget'>Create a new budget</Link>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Dashboard