import { Link } from 'gatsby'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import Select from 'react-select'
import { GetAllExpenseItems, PostExpenseItem } from '../../../services/api'
import STCard from '../../stcard'

const Index = () => {
    const [expenses, setExpenses] = useState([]);
    useEffect(() => {
        getExpenseItems();
    }, [])

    const getExpenseItems = async () => {
        try {
            const { data } = await GetAllExpenseItems();
            setExpenses(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddExpense = () => {
        getExpenseItems()
    };

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h1>Hello John!</h1>
                    <p>Are you ready to track your expenses today?</p>
                </Col>
            </Row>
            <Row>
                <Col lg={3}><AddExpenseForm onAddExpense={handleAddExpense} /></Col>
                <Col lg={9}><ExpensesTable expenses={expenses} /></Col>
            </Row>
            <NoBudgetView />
        </Container>
    )
}

export default Index;

// Expenses table view 

const ExpensesTable = ({ expenses }) => {

    return (
        <STCard>
            <Row>
                <Col>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Note</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses && expenses.map(item => (
                                <tr key={item.id}>
                                    <td>{item.attributes.Category.name}</td>
                                    <td>{item.attributes.date}</td>
                                    <td>{item.attributes.note}</td>
                                    <td>{item.attributes.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </STCard>
    )
}


// Add expense form view

const AddExpenseForm = ({ onAddExpense }) => {

    const [category, setCategory] = useState()
    const [categoryName, setCategoryName] = useState()
    const [categoryIcon, setCategoryIcon] = useState()
    const [date, setDate] = useState()
    const [value, setvalue] = useState()
    const [note, setNote] = useState()

    const options = [
        { value: 'dinning', label: 'Dinning', icon: 'Coffee' },
        { value: 'entertainment', label: 'Entertainment', icon: 'Music' },
        { value: 'groceries', label: 'Groceries', icon: 'ShoppingCart' }
    ]

    const onCategoryChange = (event) => {
        setCategory(event.value)
        setCategoryName(event.label)
        setCategoryIcon(event.icon)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const expenseItemPayload = {
            "data": {
                "Category": {
                    "name": categoryName,
                    "value": category,
                    "icon": categoryIcon
                },
                "date": date,
                "value": value,
                "note": note
            }
        }

        try {
            await PostExpenseItem(expenseItemPayload);
            onAddExpense(); // update expenses state with the new expense
            handleReset()
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const handleReset = () => {
        setCategory();
        setCategoryName();
        setCategoryIcon();
        setDate();
        setvalue();
        setNote();
    };

    return (
        <STCard>
            <h5 className='mb-4'>Log your expense</h5>
            <Form>
                <Form.Group className='mb-3'>
                    <Form.Label>What did you spend on?</Form.Label>
                    <Select options={options} onChange={onCategoryChange} />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>When did you spend?</Form.Label>
                    <Form.Control type="date" placeholder="Enter date" value={date} onChange={event => setDate(event.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>How much did you spend?</Form.Label>
                    <Form.Control type="number" placeholder="Enter amount" value={value} onChange={event => setvalue(event.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group className='mb-4'>
                    <Form.Label>Quick note</Form.Label>
                    <Form.Control as="textarea" rows={3} value={note} onChange={event => setNote(event.target.value)} />
                </Form.Group>
                <Button className='w-100' onClick={handleSubmit}>Add expense</Button>
            </Form>
        </STCard>
    )
}

const NoBudgetView = () => {
    const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null
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