import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default function myForm({ name, value, handleChange }) {
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
}