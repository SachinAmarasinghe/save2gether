import React from 'react'
import { Router } from '@reach/router'
import Dashboard from '../../components/app/dashboard'
import Budget from '../../components/app/budget'
import PrivateRoute from '../../components/privateRoute'
import Signin from '../../components/app/signin'
import Signup from '../../components/app/signup'
import { setAuthToken } from '../../services/setAuthToken'

const App = () => {
    const token = sessionStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return (
        <Router basepath='/app'>
            <PrivateRoute component={Dashboard} path='/' />
            <PrivateRoute component={Budget} path='/budget' />
            <Signin path="/signin" />
            <Signup path="/signup" />
        </Router>
    )
}

export default App