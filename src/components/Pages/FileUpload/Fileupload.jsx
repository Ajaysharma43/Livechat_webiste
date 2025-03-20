import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { UploadFile } from '../../../Redux/features/uploadreducer';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FileUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const formRef = useRef();
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const filesArray = Array.from(event.target.files);
        setSelectedFiles(filesArray);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
    
        if (selectedFiles.length === 0) {
            console.log("No files selected!");
            return;
        }
    
        setLoading(true);

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('files', file);
        });

        try {
            await dispatch(UploadFile({ formData }));
            formRef.current.reset();
            setSelectedFiles([]);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[100vh] bg-gray-900">
            <motion.div 
                className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-lg m-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-white text-3xl font-semibold text-center mb-6">Upload Files</h1>

                {/* View Images Button */}
                <motion.button 
                    onClick={() => navigate("/images")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mb-4 px-5 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
                >
                    View Images
                </motion.button>

                {/* File Input */}
                <form 
                    onSubmit={handleUpload} 
                    encType="multipart/form-data" 
                    ref={formRef} 
                    className="flex flex-col items-center space-y-6"
                >
                    <label className="w-full border-2 border-dashed border-gray-600 p-6 text-gray-400 rounded-lg cursor-pointer hover:border-blue-400 hover:text-white transition text-center">
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={handleFileChange} 
                            className="hidden"
                        />
                        {selectedFiles.length > 0 ? (
                            <p className="text-white">{selectedFiles.length} file(s) selected</p>
                        ) : (
                            <p className="text-lg">Click to Upload</p>
                        )}
                    </label>

                    {/* Loader */}
                    {loading && <div className="text-blue-400 font-semibold text-lg">Uploading...</div>}

                    {/* Upload Button */}
                    <motion.button 
                        type="submit" 
                        disabled={loading} 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        className={`w-full py-3 text-white font-medium rounded-lg transition ${
                            loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {loading ? "Uploading..." : "Upload Files"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default FileUpload;
