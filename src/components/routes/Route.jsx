import { useRoutes } from "react-router-dom"
import FileUpload from "../Pages/FileUpload/Fileupload"
import Files from "../Pages/ShowFIles/ShowFiles"
import Chat from "../Pages/chat/chat"

const Routes = () => {
    const Route = useRoutes([
        {element : <FileUpload/> , path:'/Upload'},
        {element : <Files/> , path:'/Images'},
        {element : <Chat/> , path:"/chat"}
    ])
    return Route
}

export default Routes