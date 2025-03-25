import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetFiles } from "../../../Redux/features/uploadreducer";
import { Link, useNavigate } from "react-router-dom";

const Files = () => {
    const Images = useSelector((state) => state.uploadFileReducer.Data)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [limit, setDisplayLimit] = useState(15);
    const [loading, setLoading] = useState(false);

   
    useEffect(() => {
        dispatch(GetFiles({ limit }));
    }, [dispatch, limit]); 

   
    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 10 && !loading && Images.length >= limit) {
            setLoading(true);

            setTimeout(() => {
                setDisplayLimit((prevLimit) => prevLimit + 10); // ✅ Ensures updated state
                setLoading(false);
            }, 3000);
        }
    }, [loading, Images.length, limit]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]); 

    return (
        <div className="p-4">
            <div className="flex justify-end mb-4">
                <button 
                    onClick={() => navigate("/upload")} 
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Upload New Files
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Images.slice(1, limit).map((item, index) => ( 
                    <Link to={`/chat/${encodeURIComponent(item)}`} key={index}>
                        <div className="overflow-hidden rounded-lg shadow-md">
                            <img 
                                src={item} 
                                alt={`Uploaded file ${index}`} 
                                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                    </Link>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center mt-4">
                    <div className="border-t-4 border-teal-600 w-[50px] rounded-full h-[50px] animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default Files;
