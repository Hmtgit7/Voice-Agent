// src/hooks/useForm.js
import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validate) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = useCallback(
        (e) => {
            const { name, value, type, checked } = e.target;

            setValues((prevValues) => ({
                ...prevValues,
                [name]: type === 'checkbox' ? checked : value,
            }));

            if (touched[name] && validate) {
                const validationErrors = validate({
                    ...values,
                    [name]: type === 'checkbox' ? checked : value,
                });
                setErrors(validationErrors);
            }
        },
        [touched, validate, values]
    );

    const handleBlur = useCallback(
        (e) => {
            const { name } = e.target;

            setTouched((prevTouched) => ({
                ...prevTouched,
                [name]: true,
            }));

            if (validate) {
                const validationErrors = validate(values);
                setErrors(validationErrors);
            }
        },
        [validate, values]
    );

    const handleSubmit = useCallback(
        (onSubmit) => (e) => {
            e.preventDefault();

            // Mark all fields as touched
            const allTouched = Object.keys(values).reduce(
                (acc, key) => ({ ...acc, [key]: true }),
                {}
            );
            setTouched(allTouched);

            // Validate all fields
            if (validate) {
                const validationErrors = validate(values);
                setErrors(validationErrors);

                // If there are errors, don't submit
                if (Object.keys(validationErrors).length > 0) {
                    return;
                }
            }

            onSubmit(values);
        },
        [validate, values]
    );

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    const setFieldValue = useCallback((name, value) => {
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }, []);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        setFieldValue,
        setValues,
    };
};

export default useForm;