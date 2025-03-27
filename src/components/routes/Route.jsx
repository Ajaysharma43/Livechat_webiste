import { useRoutes } from "react-router-dom";
import FileUpload from "../Pages/FileUpload/Fileupload";
import Files from "../Pages/ShowFIles/ShowFiles";
import Chat from "../Pages/chat/chat";
import Signup from "../Pages/Signup/Signup";
import Login from "../Pages/Login/login";
import AuthMiddleware from "../../../Middleware/AuthMiddleware";
import Unauthorized from "../Pages/Unauthorized/Unauthorized";
import RoleMiddleware from "../../../Middleware/RoleMiddleware";

const Routes = () => {
  const Route = useRoutes([
    {
      element: (
        <AuthMiddleware>
          <RoleMiddleware>
          <FileUpload />
          </RoleMiddleware>
        </AuthMiddleware>
      ),
      path: "/Upload",
    },
    {
      element: (
        <AuthMiddleware>
          <Files />
        </AuthMiddleware>
      ),
      path: "/Images",
    },
    {
      element: (
        <AuthMiddleware>
          <Chat />
        </AuthMiddleware>
      ),
      path: "/chat/:id",
    },
    { element: <Signup />, path: "/signup" },
    { element: <Login />, path: "/login" },
    {element : <Unauthorized/> , path : '*'}
  ]);
  return Route;
};

export default Routes;
