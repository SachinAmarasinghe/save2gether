import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap'
import { PostBudget } from '../../../services/api'
import STCard from '../../stcard'
import * as styles from '../budget/style.module.scss'
import { navigate } from '@reach/router';

const Index = () => {
    const budgetCategories = [
        { value: 'dinning', label: 'Dinning', icon: 'Coffee' },
        { value: 'entertainment', label: 'Entertainment', icon: 'Music' },
        { value: 'groceries', label: 'Groceries', icon: 'ShoppingCart' }
    ]


    const [activeSection, setActiveSection] = useState(1)
    // budget data 
    const [budgetName, setBudgetName] = useState("")
    const [budgetFrom, setBudgetFrom] = useState("")
    const [budgetTill, setBudgetTill] = useState("")
    const [isValid, setIsValid] = useState(false);
    useEffect(() => {
        // Check if all inputs are filled
        if (budgetName && budgetFrom && budgetTill) {
            const from = new Date(budgetFrom);
            const till = new Date(budgetTill);

            if (!isNaN(from.getTime()) && !isNaN(till.getTime()) && from <= till) {
                setIsValid(true);
            } else {
                setIsValid(false);
            }
        } else {
            setIsValid(false);
        }
    }, [budgetName, budgetFrom, budgetTill]);

    // income and expenses 
    const [income, setIncome] = useState();
    const [budgetItems, setBudgetItems] = useState([]);
    const [budgetSavings, setbudgetSavings] = useState();
    const [budgetTotal, setBudgetTotal] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const budgetPayload = {
            "data": {
                "name": budgetName,
                "startDate": budgetFrom,
                "endDate": budgetTill,
                "income": income,
                "total": budgetTotal,
                "expenses": budgetItems
            }
        }
        try {
            const response = await PostBudget(budgetPayload)
            console.log(response)
            setIsSubmitting(false);
            setBudgetName('');
            setBudgetFrom('');
            setBudgetTill('');
            setIncome('');
            setBudgetTotal('');
            setBudgetItems([]);
            navigate('/app');
        } catch (error) {
            console.log(error)
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        calcTotalAndSavings()
    }, [income, budgetItems])

    const calcTotalAndSavings = () => {
        const totalBudget = budgetItems.reduce(
            (acc, item) => acc + parseFloat(item.amount),
            0
        );
        setBudgetTotal((totalBudget).toFixed(2))
        const savings = ((isNaN(income) || isNaN(totalBudget)) ? 0 : income - totalBudget).toFixed(2);
        setbudgetSavings(savings);
    }

    const incomeOnchange = (event) => {
        const value = event.target.value;
        const numDecimals = (value.split('.')[1] || '').length;

        if (numDecimals > 2) {
            const roundedValue = parseFloat(value).toFixed(2);
            setIncome(roundedValue);
        } else {
            setIncome(value);
        }
    }


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const label = event.target.getAttribute('data-label');
        const index = budgetCategories.findIndex((category) => category.value === name);
        const updatedBudgetItems = [...budgetItems];
        const roundedValue = Math.round(parseFloat(value) * 100) / 100;
        const formattedValue = roundedValue.toFixed(2);

        if (formattedValue === 'NaN') {
            updatedBudgetItems.splice(index, 1);
        } else {
            updatedBudgetItems[index] = { name: label, amount: formattedValue, value: name };
        }
        setBudgetItems(updatedBudgetItems);
        calcTotalAndSavings()
    }

    const inputFields = budgetCategories.map((category) => {
        const index = budgetCategories.findIndex((c) => c.value === category.value);
        const budgetItem = budgetItems[index] || {};
        return (
            <div key={category.value}>
                <Form.Label>{category.label}</Form.Label>
                <InputGroup className="w-100 mb-3">
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control type='number' data-label={category.label} name={category.value} defaultValue={budgetItem.amount || ''} id={category.value} onChange={handleInputChange} />
                </InputGroup>
            </div>
        );
    });
    return (
        <>
            <Container>
                <Row>
                    <Col className={styles.wrapper} lg={12}>
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
                                                    <Button disabled={!isValid} className='mt-4 w-100' onClick={() => setActiveSection(2)}>Next</Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Col>
                                </Row>
                            }

                            {/* Add expenses for the budget period  */}
                            {activeSection === 2 &&
                                <Row>
                                    <Col lg={8} md={6} sm={12} className="border-end">
                                        <h4 className={styles.heading1}>Let’s create a simple budget for the month</h4>
                                        <p>What’s your income for the month?</p>
                                        <Form>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text>$</InputGroup.Text>
                                                <Form.Control type='number' value={income} onChange={incomeOnchange} />
                                            </InputGroup>
                                            <p>What’s will be your expenses for the month?</p>
                                            {inputFields}
                                        </Form>
                                        <Button onClick={() => setActiveSection(1)}>Back</Button>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <h4 className={styles.heading1}>Your monthly budget</h4>
                                        <table className={styles.table}>
                                            {income ? <thead>
                                                <tr>
                                                    <th>Income</th>
                                                    <th>$ {income}</th>
                                                </tr>
                                            </thead> : ''}

                                            <tbody>
                                                {budgetItems.length > 0 ? <tr>
                                                    <th scope='2'>Expenses</th>
                                                </tr> : ''}

                                                {
                                                    budgetItems && budgetItems.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.name}</td>
                                                            <td><b>$ {item.amount}</b></td>
                                                        </tr>
                                                    ))
                                                }
                                                {(budgetTotal > 0 || income) ?
                                                    <>
                                                        {budgetTotal !== 0 && <tr>
                                                            <td><b>Total expenses</b></td>
                                                            <td><b>$ {budgetTotal}</b></td>
                                                        </tr>}
                                                        {budgetSavings !== 0 && <tr>
                                                            <td><b>Total savings</b></td>
                                                            <td><b>$ {budgetSavings}</b></td>
                                                        </tr>}
                                                    </>
                                                    : ''
                                                }

                                            </tbody>
                                        </table>
                                        {(!income || budgetItems.length < 0) ?
                                            <div className={styles.feedbackText}>
                                                <p>Add values to your budget and see your budget breakdown.</p>
                                            </div>
                                            :
                                            <div className={styles.feedbackText}>
                                                {(budgetSavings > 0) &&
                                                    <>
                                                        <p><b>Congratulations!</b></p>
                                                        <p>If you stick to the above budget you’ll be able to save <strong>$ {budgetSavings}</strong> this month. That’s <strong>{(budgetSavings / income * 100).toFixed(0)}% of your income</strong>, which is really outstanding!</p>
                                                    </>
                                                }
                                                {(budgetSavings == 0) &&
                                                    <>
                                                        <p><b>You're on track!</b></p>
                                                        <p>Stick to this budget and you'll be able to get through the budget period without any losses!</p>
                                                    </>
                                                }
                                                {(budgetSavings < 0) &&
                                                    <>
                                                        <p><b>Oh!</b></p>
                                                        <p>Seems like you'll be running a defecit of <strong>$ {budgetSavings}</strong> for this period. See if you can reduce some expenses and manage.</p>
                                                    </>
                                                }

                                            </div>
                                        }
                                        {income && budgetItems.length > 0 ?
                                            <Button disabled={isSubmitting} className='w-100 mt-3' onClick={handleSubmit}>{isSubmitting ? "Saving your budget" : "Save and continue"}</Button> : ''
                                        }

                                    </Col>
                                </Row>
                            }
                        </STCard>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default Index