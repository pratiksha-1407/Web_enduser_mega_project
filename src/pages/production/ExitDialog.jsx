import React from 'react';
import './ExitDialog.css';

export default function ExitDialog({ onCancel, onExit }) {
    return (
        <div className="exit-dialog-overlay">
            <div className="exit-dialog">
                <div className="exit-dialog-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="#2196F3">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </div>
                <h2 className="exit-dialog-title">Exit the app?</h2>
                <p className="exit-dialog-message">
                    Are you sure you want to exit?
                </p>
                <div className="exit-dialog-actions">
                    <button className="exit-dialog-cancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="exit-dialog-exit" onClick={onExit}>
                        Exit
                    </button>
                </div>
            </div>
        </div>
    );
}
