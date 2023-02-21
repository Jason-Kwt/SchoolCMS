import React from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const InputForm = ({ name, value, handleChange }) => {
  return (
    <>
      <FloatingLabel
        label={name}
        className="mb-3"
        controlId={`formBasic` + name}
      >
        <Form.Control
          required
          type="text"
          placeholder={name}
          name={name}
          value={value}
          onChange={handleChange}
        />
      </FloatingLabel>
    </>
  );
};

export default InputForm;
