import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set the path to the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdfjs/pdf.worker.min.js`;

const PdfViewer = ({ pdfUrl, isAdmin, socket }) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [error, setError] = useState(null); // To handle PDF loading error

    useEffect(() => {
        // Listen for page changes from the server
        socket.on('page-change', (page) => {
            setPageNumber(page);
        });

        // Cleanup listener on component unmount
        return () => {
            socket.off('page-change');
        };
    }, [socket]);

    // Handle the successful loading of the document
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setError(null); // Reset any error when the document is loaded successfully
    };

    // Handle errors while loading the document
    const onDocumentLoadError = (error) => {
        setError('Failed to load PDF file. Please try again later.');
        console.error(error); // Log the error for debugging
    };

    // Change the page for admin control
    const changePage = (newPageNumber) => {
        if (isAdmin) {
            setPageNumber(newPageNumber);
            socket.emit('page-change', newPageNumber); // Emit the page change to other users
        }
    };

    // Navigate to the previous page
    const goToPreviousPage = () => {
        if (pageNumber > 1) {
            changePage(pageNumber - 1);
        }
    };

    // Navigate to the next page
    const goToNextPage = () => {
        if (pageNumber < numPages) {
            changePage(pageNumber + 1);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            {/* Display the error message if PDF fails to load */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
            >
                <Page pageNumber={pageNumber} />
            </Document>

            <p>
                Page {pageNumber} of {numPages}
            </p>

            {/* Admin can navigate pages */}
            {isAdmin && (
                <div>
                    <button onClick={goToPreviousPage} disabled={pageNumber === 1}>
                        Previous
                    </button>
                    <button onClick={goToNextPage} disabled={pageNumber === numPages}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default PdfViewer;
