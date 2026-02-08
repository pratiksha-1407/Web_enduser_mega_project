import React from 'react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="p-6 flex flex-col items-center justify-center h-[80vh] text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
            <p className="text-gray-500 max-w-md">
                This module is currently under development. Please check back later for updates or use the mobile app for this feature.
            </p>
        </div>
    );
};

export default PlaceholderPage;
