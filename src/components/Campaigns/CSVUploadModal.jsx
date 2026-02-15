import { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import './AIComponents.css';

const CSVUploadModal = ({ isOpen, onClose, onNext }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    setError(null);
    
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV file. Please check the format.');
          return;
        }
        
        if (results.data.length === 0) {
          setError('CSV file is empty');
          return;
        }

        setParsedData(results);
      },
      error: () => {
        setError('Failed to parse CSV file');
      }
    });
  };

  const handleNext = () => {
    if (parsedData) {
      onNext(parsedData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedData(null);
    setError(null);
    setIsDragging(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Upload Contact List</h2>
            <p className="text-muted">Upload a CSV file containing your contacts</p>
          </div>
          <button className="icon-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="csv-format-box">
            <h4>Expected CSV format</h4>
            <p className="csv-format-required">
              <strong>Required columns:</strong> Email, First Name, Last Name
            </p>
            <p className="csv-format-optional">
              <strong>Optional:</strong> Job Title, Company, Website, Phone, City, State, Country, Zip Code, Industry
            </p>
            <p className="csv-format-note">
              First row must be headers. You can also use <strong>Full Name</strong> (instead of First + Last) or <strong>Role</strong> (instead of Job Title)—we&apos;ll map them in the next step.
            </p>
          </div>

          {!parsedData ? (
            <div
              className={`csv-upload-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="upload-icon" />
              <h3>Drag & drop your CSV file here</h3>
              <p className="text-muted">or click to browse files</p>
              <p className="upload-hint">CSV only, max 5MB. First row = column headers.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,application/csv,text/comma-separated-values"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="csv-preview">
              <div className="file-info">
                <FileText size={24} className="text-primary" />
                <div className="file-details">
                  <h4>{file.name}</h4>
                  <p className="text-muted">
                    {parsedData.data.length} contacts • {Object.keys(parsedData.data[0] || {}).length} fields
                  </p>
                </div>
                <CheckCircle size={24} className="text-success" />
              </div>

              <div className="preview-table-container">
                <h4>Data Preview (First 10 rows)</h4>
                <div className="table-scroll">
                  <table className="data-preview-table">
                    <thead>
                      <tr>
                        {Object.keys(parsedData.data[0] || {}).map((header) => (
                          <th key={header}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.data.slice(0, 10).map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((value, cellIdx) => (
                            <td key={cellIdx}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          {parsedData && (
            <button className="btn btn-primary" onClick={handleNext}>
              Next: Map Fields →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVUploadModal;
