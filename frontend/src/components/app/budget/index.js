import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap'
import STCard from '../../stcard'
import * as styles from '../budget/style.module.scss'
import Select from 'react-select'
import { GetAllCommonExpenses, GetAllUserExpenses } from '../../../services/api'
import * as Icon from 'react-feather'

const Index = () => {
    const [activeSection, setActiveSection] = useState(1)
    // budget data 
    const [budgetName, setBudgetName] = useState("")
    const [budgetFrom, setBudgetFrom] = useState("")
    const [budgetTill, setBudgetTill] = useState("")
    // expenses 
    const [newExpenses, setNewExpenses] = useState([])
    const [checkedExpenses, setCheckedExpenses] = useState([]);
    // income and expenses 
    const [income, setIncome] = useState();
    const [selectedCategory, setSelectedCategory] = useState();
    const [expenseValue, setExpenseValue] = useState();
    const [expenses, setExpenses] = useState([]);


    useEffect(() => {
        const getExpenses = async () => {
            const commonExpenses = await GetAllCommonExpenses();
            const userExpenses = await GetAllUserExpenses();
            if (userExpenses.length > 0) {
                setNewExpenses(userExpenses.data.data);
            } else {
                setNewExpenses(commonExpenses.data.data);
            }
        }
        getExpenses()
    }, [])

    const handleExpensesChange = (event) => {
        const value = event.target.value;
        const index = checkedExpenses.indexOf(value);

        if (index > -1) {
            // If the checkbox was previously checked, remove its value from the state
            setCheckedExpenses(checkedExpenses.filter((item) => item !== value));
        } else {
            // If the checkbox was previously unchecked, add its value to the state
            setCheckedExpenses([...checkedExpenses, value]);
        }
    };

    const expenseOptionsArray = checkedExpenses.map(item => {
        const label = item.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return { value: item, label: label };
    });

    const onCategoryChange = (event) => {
        setSelectedCategory(event.target.value)
    }

    const onAddExpense = () => {
        setExpenses([...expenses, { category: selectedCategory, value: expenseValue }]);
        setSelectedCategory("");
        setExpenseValue("");
    };

    return (
        <Container>
            <Row>
                <Col className={styles.wrapper}>
                    <STCard>
                        {/* Budget name and time period  */}
                        {activeSection === 1 &&
                            <Row className='justify-content-center'>
                                <Col lg={12}>
                                    <h4 className={styles.heading1}>Let’s give your budget a name and a time period</h4>
                                    <Form>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Name of the budget</Form.Label>
                                            <Form.Control type="text" placeholder="Enter name" value={budgetName} onChange={event => setBudgetName(event.target.value)}>
                                            </Form.Control>
                                        </Form.Group>
                                        <Row>
                                            <Col>
                                                <Form.Label>From</Form.Label>
                                                <Form.Control type="date" placeholder="Enter budget start date" value={budgetFrom} onChange={event => setBudgetFrom(event.target.value)}>
                                                </Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Label>Till</Form.Label>
                                                <Form.Control type="date" placeholder="Enter budget end date" value={budgetTill} onChange={event => setBudgetTill(event.target.value)}>
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                        <Row className='justify-content-end'>
                                            <Col lg={4}>
                                                <Button className='mt-4 w-100' onClick={() => setActiveSection(2)}>Next</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                        }
                        {/* Configure expense categories  */}
                        {activeSection === 2 &&
                            <Row className='justify-content-center'>
                                <Col lg={12} md={12} sm={12}>
                                    <h4 className={styles.heading1}>What will you be spending on during this budget period?</h4>
                                    <Form>
                                        <div className={styles.expensesWrapper}>
                                            {newExpenses.map(expense => (
                                                <label key={expense.id} className={styles.checkboxCard}>
                                                    <input type="checkbox"
                                                        value={expense.attributes.value}
                                                        checked={checkedExpenses.includes(expense.attributes.value)}
                                                        onChange={handleExpensesChange}
                                                    />
                                                    <div className={styles.cardContent}>
                                                        <span className={styles.checkboxText}>{expense.attributes.name}</span>
                                                        <div className={styles.checkboxCircle}></div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        <Row className='justify-content-between'>
                                            <Col lg={4}>
                                                <Button className='mt-4 w-100' onClick={() => setActiveSection(1)}>Back</Button>
                                            </Col>
                                            <Col lg={4}>
                                                <Button className='mt-4 w-100' onClick={() => setActiveSection(3)}>Next</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                        }
                        {/* Add expenses for the budget period  */}
                        {activeSection === 3 &&
                            <Row>
                                <Col lg={8} md={6} sm={12} className="border-end">
                                    <h4 className={styles.heading1}>Let’s create a simple budget for the month</h4>
                                    <p>What’s your income for the month?</p>
                                    <Form>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>$</InputGroup.Text>
                                            <Form.Control value={income} onChange={event => setIncome(event.target.value)} aria-label="Amount (to the nearest dollar)" />
                                            <InputGroup.Text>.00</InputGroup.Text>
                                        </InputGroup>
                                        <p>What’s will be your expenses for the month?</p>
                                        <Row className='align-items-end'>
                                            <Col lg={6} md={12}>
                                                <Form.Group className='w-100'>
                                                    <Form.Label>Expense</Form.Label>
                                                    <Select options={expenseOptionsArray} onChange={onCategoryChange} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} md={12}>
                                                <InputGroup className="w-100">
                                                    <InputGroup.Text>$</InputGroup.Text>
                                                    <Form.Control value={expenseValue} onChange={(event) => setExpenseValue(event.target.value)} />
                                                    <InputGroup.Text>.00</InputGroup.Text>
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                        <div className='d-block text-end pt-4'>
                                            <Button variant='outline-secondary'>Add another expense</Button>
                                        </div>

                                    </Form>
                                    <Button onClick={() => setActiveSection(2)}>Back</Button>
                                </Col>
                                <Col lg={4} md={6} sm={12}>
                                    <h4 className={styles.heading1}>Your monthly budget</h4>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Income</th>
                                                <th>$ 3,250.00</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th scope='2'>Expenses</th>
                                            </tr>
                                            <tr>
                                                <td>Groceries</td>
                                                <td><b>- $ 350.00</b></td>
                                            </tr>
                                            <tr>
                                                <td>Groceries</td>
                                                <td><b>- $ 350.00</b></td>
                                            </tr>
                                            <tr>
                                                <td>Groceries</td>
                                                <td><b>- $ 350.00</b></td>
                                            </tr>
                                            <tr>
                                                <td>Groceries</td>
                                                <td><b>- $ 350.00</b></td>
                                            </tr>
                                            <tr>
                                                <td>Groceries</td>
                                                <td><b>- $ 350.00</b></td>
                                            </tr>
                                            <tr>
                                                <td>Groceries</td>
                                                <td><b>- $ 350.00</b></td>
                                            </tr>
                                            <tr>
                                                <td><b>Total</b></td>
                                                <td><b>$ 2350.00</b></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className={styles.feedbackText}>
                                        <p><b>Congratulations!</b></p>
                                        <p>If you stick to the above budget you’ll be able to save <strong>$ 400.00</strong> this month. That’s <strong>20% of your income</strong>, which is really outstanding!</p>
                                    </div>
                                    <Button className='w-100'>Save and continue</Button>
                                </Col>
                            </Row>
                        }
                    </STCard>
                </Col>
            </Row>
        </Container>
    )
}
export default Index