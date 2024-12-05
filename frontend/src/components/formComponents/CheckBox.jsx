import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const Checkbox = ({ name, label, defaultValue = false, className, ...props }) => {
  const { control } = useFormContext(); // Access form control

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <div className={`flex items-center mb-4 ${className || ''}`}>
          <input
            id={name}
            type="checkbox"
            checked={value || false} // Ensures checkbox is checked if value is true
            onChange={(e) => onChange(e.target.checked)} // Sends true/false based on checked status
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            {...props}
          />
          {label && (
            <label htmlFor={name} className="ml-2 text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
        </div>
      )}
    />
  );
};

export default Checkbox;
