import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

const Input = ({
  name,
  label,
  type = 'text',
  className,
  defaultValue = '',
  ...props
}) => {
  const { register,control } = useFormContext(); // Accessing control from form context

  const defaultStyle =
    'w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className={`flex flex-col mb-4 ${className || ''}`}>
      {label && (
        <label htmlFor={name} className="mb-2 text-sm font-semibold">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error } }) => (
          <>
            <input
              id={name}
              type={type}
              {...register(name)}
              {...props}
              className={`${
                className ? className : defaultStyle
              } ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error && <span className="text-sm text-red-500">{error.message}</span>}
          </>
        )}
      />
    </div>
  );
};

export default Input;
