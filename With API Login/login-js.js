import { useState } from 'react';
import { h } from 'https://cdnjs.cloudflare.com/ajax/libs/preact/10.19.3/preact.module.js';

export function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await window.Reflow.auth.login({
                email: formData.email,
                password: formData.password
            });
            
            if (response.success) {
                window.location.href = 'index.html';
            }
        } catch (error) {
            setErrors({ submit: 'Login failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Rest of your component code, converted to use h() instead of JSX
    return h('div', { className: 'min-h-screen bg-gray-100 flex flex-col justify-center' },
        // Convert the rest of your JSX to h() calls
    );
}