import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

const Select = ({ name, label, options }) => {
  const { register,control } = useFormContext(); // Accessing control from form context

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <select
              id={name}
              {...register(name)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an option</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldState?.error && (
              <p className="mt-1 text-sm text-red-600">{fieldState?.error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default Select;
