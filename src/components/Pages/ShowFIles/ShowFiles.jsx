import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetFiles } from "../../../Redux/features/uploadreducer";
import { Link, useNavigate } from "react-router-dom";

const Files = () => {
    const Images = useSelector((state) => state.uploadFileReducer.Data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(GetFiles());
        console.log(Images);
    }, [dispatch]);

    return (
        <div className="p-4">
            {/* Button to navigate to Upload Route */}
            <div className="flex justify-end mb-4">
                <button 
                    onClick={() => navigate("/upload")} 
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Upload New Files
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Images.map((item, index) => (
                    <Link to={`/chat/${encodeURIComponent(item)}`} key={index}>
                        <div className={`${index == 0? "hidden" : "overflow-hidden rounded-lg shadow-md"}`}>
                            <img 
                                src={item} 
                                alt={`Uploaded file ${index}`} 
                                className={` ${index == 0? "hidden" : "w-full h-48 object-cover transition-transform duration-300 hover:scale-105"}`}
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Files;
