import axios from 'axios'
import { setAuthToken } from '../services/setAuthToken'

// signup api call --------------------------------------------------------------------------------------
export const Signup = async (signupPayload) => {
    try {
        const response = await axios.post("http://localhost:1337/api/auth/local/register", signupPayload);

        //get token from response
        const token = response.data.jwt;
        const user = response.data.user;

        //set JWT token to session storage
        sessionStorage.setItem("token", token);

        //set user details to session storage
        sessionStorage.setItem("user", JSON.stringify(user));

        //set token to axios common header
        setAuthToken(token);

        //redirect user to home page
        window.location.href = '/app';

        // return response to calling code
        return response;
    } catch (error) {
        return error.response.data.error;
    }
};

// signin api call -------------------------------------------------------------------------------------------
export const Signin = async (signinPayload) => {

    try {
        const response = await axios.post("http://localhost:1337/api/auth/local", signinPayload);
        const token = response.data.jwt;
        const user = response.data.user;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        setAuthToken(token);
        window.location.href = '/app'
        return response;
    } catch (error) {
        return error.response.data.error
    }
}

// budget api calls -------------------------------------------------------------------------------------------

// GET All CommonExpenses 

export const GetAllCommonExpenses = async () => {
    try {
        const response = await axios.get("http://localhost:1337/api/expense-commons");
        return response;
    } catch (error) {
        console.log(error)
    }
}

// GET All User expenses list

export const GetAllUserExpenses = async () => {
    try {
        const response = await axios.get("http://localhost:1337/api/expense-users");
        return response;
    } catch (error) {
        console.log(error)
    }
}

// GET All Budgets 

export const GetAllBudgets = async () => {
    try {
        const response = await axios.get("http://localhost:1337/api/budgets?populate=*");
        return response;
    } catch (error) {
        console.log(error)
    }
}