const Auth = () => {
    const token = sessionStorage.getItem('token')
    if (!token) return false
    else return true
}

export default Auth