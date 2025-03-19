import { useRoutes } from "react-router-dom";
import FileUpload from "../Pages/FileUpload/Fileupload";
import Files from "../Pages/ShowFIles/ShowFiles";
import Chat from "../Pages/chat/chat";
import Signup from "../Pages/Signup/Signup";
import Login from "../Pages/Login/login";
import AuthMiddleware from "../../../Middleware/AuthMiddleware";

const Routes = () => {
  const Route = useRoutes([
    {
      element: (
        <AuthMiddleware>
          <FileUpload />
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
      path: "/chat",
    },
    { element: <Signup />, path: "/signup" },
    { element: <Login />, path: "/login" },
  ]);
  return Route;
};

export default Routes;
