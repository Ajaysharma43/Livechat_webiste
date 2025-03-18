import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { UploadFile } from '../../../Redux/features/uploadreducer';

const FileUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const dispatch = useDispatch();

    const handleFileChange = (event) => {
        const filesArray = Array.from(event.target.files); // Convert FileList to array
        setSelectedFiles(filesArray);
    };

    const handleUpload = (event) => {
        event.preventDefault(); // Prevent default form submission
    
        if (selectedFiles.length === 0) {
            console.log("No files selected!");
            return;
        }
    
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('files', file); // Ensure key matches backend expectation
        });
    
        // Debugging: Check FormData entries
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]); // Logs key-value pairs
        }
    
        dispatch(UploadFile({formData})); // Pass formData directly
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-red-300 text-2xl mb-4">Upload</h1>
            <form onSubmit={handleUpload} encType='multipart/form-data'>
                <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileChange} 
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Upload Files
                </button>
            </form>
        </div>
    );
};

export default FileUpload;