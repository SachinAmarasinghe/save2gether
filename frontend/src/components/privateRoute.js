import React from "react"
import { navigate } from "gatsby"
import Auth from '../services/auth'

const PrivateRoute = ({ component: Component, location, ...rest }) => {
    console.log('Auth status : ', Auth())
    if (!Auth() && location.pathname !== `/app/signin`) {
        navigate("/app/signin")
        return null
    }

    return <Component {...rest} />
}

export default PrivateRoute