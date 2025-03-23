import React from "react";

const GlobalSpinner = ({ size = "w-6 h-6" }) => {
  return (
    <div className={`border-4 border-white border-t-transparent rounded-full animate-spin ${size}`}></div>
  );
};

export  { GlobalSpinner };