import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"

const RoleMiddleware = ({children}) => {
    const navigate  = useNavigate()
    const [isAuthenticated , setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token  = sessionStorage.getItem('AccessToken');
        const decoded = jwtDecode(token);
        if(decoded.Role == 'User')
        {
            navigate('*')
        }
        else if(decoded.Role == 'Admin')
        {
            setIsAuthenticated(true)
        }
    },[])

    if(isAuthenticated == false)
    {
        return null
    }
    return children
}

export default RoleMiddleware