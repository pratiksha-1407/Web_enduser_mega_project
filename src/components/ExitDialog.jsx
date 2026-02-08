import React from 'react';

const ExitDialog = ({ onCancel, onExit }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-up">
                <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Exit App?</h3>
                    <p className="text-gray-500 mb-6">Are you sure you want to log out and exit?</p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onCancel}
                            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onExit}
                            className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-sm"
                        >
                            Exit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExitDialog;
