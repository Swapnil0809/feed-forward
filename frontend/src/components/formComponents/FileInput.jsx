import React, { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

const FileInput = ({
  name,
  label,
  multiple = false,
  previewStyle = 'profile', // 'profile' or 'post'
  rules,
}) => {
  const { register,control } = useFormContext(); // Accessing control from form context
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (files) => {
    const fileArray = multiple ? Array.from(files) : [files[0]];
    const previewURLs = fileArray.map((file) => URL.createObjectURL(file));
    setPreviews(previewURLs);
  };

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  // Render preview based on style
  const renderPreview = () => {
    if (previewStyle === 'profile' && previews.length > 0) {
      return (
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #ccc',
          }}
        >
          <img
            src={previews[0]}
            alt="Profile Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      );
    }

    if (previewStyle === 'post') {
      return (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {previews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Post Preview ${index + 1}`}
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <div>
          <label>{label}</label>
          {/* Hidden input */}
          <input
            type="file"
            {...register(name)}
            style={{ display: 'none' }}
            multiple={multiple}
            onChange={(e) => {
              const files = e.target.files;
              handleFileChange(files);
              onChange(multiple ? Array.from(files) : files[0]); // Update form value
            }}
            id={name}
          />
          {/* Clickable div */}
          <div
            onClick={() => document.getElementById(name).click()}
            style={{
              padding: '20px',
              border: '2px dashed #ccc',
              cursor: 'pointer',
              textAlign: 'center',
              borderRadius: '5px',
            }}
          >
            {previews.length > 0 ? (
              renderPreview()
            ) : (
              <span>Click to select {multiple ? 'images' : 'an image'}</span>
            )}
          </div>
          {error && <span style={{ color: 'red' }}>{error.message}</span>}
        </div>
      )}
    />
  );
};

export default FileInput;
