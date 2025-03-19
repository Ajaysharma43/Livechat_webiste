import { useRoutes } from "react-router-dom"
import FileUpload from "../Pages/FileUpload/Fileupload"
import Files from "../Pages/ShowFIles/ShowFiles"
import Chat from "../Pages/chat/chat"
import Signup from "../Pages/Signup/Signup"
import Login from "../Pages/Login/login"

const Routes = () => {
    const Route = useRoutes([
        {element : <FileUpload/> , path:'/Upload'},
        {element : <Files/> , path:'/Images'},
        {element : <Chat/> , path:"/chat"},
        {element : <Signup/> , path:"/signup"},
        {element : <Login/> , path:"/login"}
    ])
    return Route
}

export default Routes