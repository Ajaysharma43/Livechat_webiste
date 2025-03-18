import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetFiles } from "../../../Redux/features/uploadreducer";
import { Link } from "react-router-dom";

const Files = () => {
    const Images = useSelector((state) => state.uploadFileReducer.Data);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(GetFiles());
        console.log(Images);
    }, [dispatch]);

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Images.map((item, index) => (
                    <Link to={`/chat`}>
                    <div key={index} className="overflow-hidden rounded-lg shadow-md">
                        <img 
                            src={item} 
                            alt={`Uploaded file ${index}`} 
                            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Files;
