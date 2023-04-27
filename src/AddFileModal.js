import React, { useRef, useState, useEffect } from 'react';
import styles from './stylesheets/AddFileModal.module.css';

function AddFileModal({ show, handleClose, handleBackdropClick, handleAddFile, selectedFile }) {
    const [file, setFile] = useState({ url: '', fileType: '', description: '' });

    const modalRef = useRef();

    useEffect(() => {
        if (show) {
            const handleClickOutside = (event) => {
                if (modalRef.current && !modalRef.current.contains(event.target)) {
                    handleBackdropClick(); // Close the modal when clicking outside of it
                }
            };

            document.addEventListener('mouseup', handleClickOutside);
            return () => {
                document.removeEventListener('mouseup', handleClickOutside);
            };
        }
    }, [show, handleBackdropClick]);

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
        <div className={`${styles.modal} ${show ? styles.show : ''}`}>
            <div className={styles['modal-content']} ref={modalRef}>
                <h3 className={styles['modal-title']}>Add File</h3>
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
                <div className={styles['modal-buttons']}>
                    <button onClick={handleSubmit}>Add File</button>
                    <button onClick={handleClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default AddFileModal;
