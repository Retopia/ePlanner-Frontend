import React, { useState, useEffect } from 'react';
import './stylesheets/AddFileModal.css';

function AddFileModal({ show, handleClose, handleAddFile, selectedFile }) {
    const [file, setFile] = useState({ url: '', fileType: '', description: '' });

    useEffect(() => {
        console.log(selectedFile);
        if (selectedFile) {
            setFile({
                ...file,
                url: selectedFile.file.url,
                fileType: selectedFile.file.fileType
            });
        } else {
            setFile({
                ...file,
                url: '',
                fileType: ''
            });
        }
    }, [selectedFile]);

    const handleSubmit = () => {
        if (file.url != '' && file.fileType != '') {
            handleAddFile(file);
            setFile({ url: '', fileType: '', description: '' });
            handleClose();
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Add File</h3>
                <input
                    type="text"
                    placeholder="File URL"
                    value={file.url}
                    onChange={(e) => setFile({ ...file, url: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="File Type"
                    value={file.fileType}
                    onChange={(e) => setFile({ ...file, fileType: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="File Description (optional)"
                    value={file.description}
                    onChange={(e) => setFile({ ...file, description: e.target.value })}
                />
                <div className="modal-buttons">
                    <button onClick={handleSubmit}>Add File</button>
                    <button onClick={handleClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default AddFileModal;
