import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PdfViewer from './components/PDFViewer';

const socket = io('http://localhost:5000'); // Socket connection to the server

function App() {
    const [pdfUrl, setPdfUrl] = useState('./files/sample.pdf'); // Path to the PDF file
    const [isAdmin, setIsAdmin] = useState(false); // Whether the user is the admin (presenter)

    // Toggle admin status
    const toggleAdmin = () => setIsAdmin(!isAdmin);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>PDF Co-Viewer</h1>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={toggleAdmin}
                    />
                    I am the presenter (Admin)
                </label>
            </div>
            <PdfViewer pdfUrl={pdfUrl} isAdmin={isAdmin} socket={socket} />
        </div>
    );
}

export default App;
