import { Link } from 'gatsby'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import Select from 'react-select'
import { GetAllBudgets, GetAllExpenseItems, PostExpenseItem } from '../../../services/api'
import STCard from '../../stcard'
import { navigate } from '@reach/router';

const Index = () => {
    const [expenses, setExpenses] = useState([]);
    const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null;
    const [allBudgets, setAllBudgets] = useState();
    const [selectedBudgetId, setSelectedBudgetId] = useState(null);

    useEffect(() => {
        getExpenseItems();
        getAllBudgets();
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


    const getAllBudgets = async () => {
        try {
            const { data } = await GetAllBudgets()
            setAllBudgets(data.data);
        } catch (error) {
            console.log(error)
        }
    }

    const currentMonthBudget = allBudgets && allBudgets.find((budget) => {
        const now = new Date();
        const startDate = new Date(budget.attributes.startDate);
        const endDate = new Date(budget.attributes.endDate);
        return (
            now.getFullYear() === startDate.getFullYear() &&
            now.getMonth() === startDate.getMonth() &&
            endDate > now
        );
    });

    const selectedBudget = allBudgets && allBudgets.find((budget) => budget.id === selectedBudgetId);

    const filteredExpenses = selectedBudget
        ? expenses.filter((expense) =>
            expense.attributes.date >= selectedBudget.attributes.startDate &&
            expense.attributes.date <= selectedBudget.attributes.endDate
        )
        : currentMonthBudget
            ? expenses.filter(
                (expense) =>
                    expense.attributes.date >= currentMonthBudget.attributes.startDate &&
                    expense.attributes.date <= currentMonthBudget.attributes.endDate
            )
            : expenses;

    const logout = () => {
        sessionStorage.clear();
        navigate('/app/signin');
    }


    return (
        <Container fluid className='pt-3'>
            {allBudgets?.length > 0 ? <>
                <Row className='mb-5'>
                    <Col>
                        <h1>Hello {user.firstname ? user.firstname : user.username}!</h1>
                        <p>Are you ready to track your expenses today?</p>
                    </Col>
                    <Col lg={1}>
                        <Button variant='danger' onClick={logout} className='w-100'>Logout</Button>
                    </Col>
                </Row>
                <Row>
                    <Col lg={3}><AddExpenseForm onAddExpense={handleAddExpense} /></Col>
                    <Col lg={9}>
                        <div className='d-flex align-items-start mb-4'>
                            <button className='btn btn-secondary me-3' onClick={() => setSelectedBudgetId(null)}>All Expenses</button>

                            {allBudgets.map((budget) => (
                                <button key={budget.id} onClick={() => setSelectedBudgetId(budget.id)} className={budget.id === selectedBudgetId ? "btn btn-primary me-3" : "btn btn-outline-primary me-3"}>
                                    {budget.attributes.name}
                                </button>
                            ))}</div>
                        <ExpensesTable expenses={filteredExpenses} />
                    </Col>
                </Row> </> : <NoBudgetView />}
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
    const [isSubmitting, setIsSubmitting] = useState(false)

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
        setIsSubmitting(true);
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
            const response = await PostExpenseItem(expenseItemPayload);
            console.log(response);
            setIsSubmitting(false);
            onAddExpense(); // update expenses state with the new expense
            handleReset();
        } catch (error) {
            console.log("Error: ", error);
            setIsSubmitting(false);
        }
    }

    const handleReset = () => {
        setCategory('');
        setCategoryName('');
        setCategoryIcon('');
        setDate('');
        setvalue('');
        setNote('');
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
                <Button disabled={isSubmitting} className='w-100' onClick={handleSubmit}>{isSubmitting ? "Adding expense" : "Add expense"}</Button>
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
                        <h1 className="display-4 text-center mb-5"><strong>Welcome to your personal Expense Tracker, {user.firstname ? user.firstname : user.username}!</strong></h1>
                        <p className='text-center mb-5'>It looks like you haven't set a budget yet. No worries, simply create a new budget and start tracking your expenses. This Dashboard will help you keep your spending in check and give you a clear overview of your financial health. Let's get started!</p>
                        <Link className='btn btn-primary' to='/app/budget'>Create a new budget</Link>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}