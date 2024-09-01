import { useRef, useState } from 'react';
import { InitialState, InitialFormStatus } from '../types';

const initialState: InitialState = {
  name: '',
  email: '',
  confirmEmail: '',
};

const initialFormStatus: InitialFormStatus = {
  isLoading: false,
};

interface Props {
  onSend: (
    data: { name: string; email: string },
    signal: AbortSignal,
  ) => Promise<{ status: string }>;
}

export function useFormData({ onSend }: Props) {
  const [formData, setFormData] = useState<InitialState>(initialState);
  const [formError, setFormError] = useState<InitialState>(initialState);
  const [formStatus, setFormStatus] = useState<InitialFormStatus>(initialFormStatus);
  const abortControllerRef = useRef<AbortController | null>(null);

  function resetFormData() {
    setFormData(initialState);
    setFormError(initialState);
    setFormStatus(initialFormStatus);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel any ongoing request
      abortControllerRef.current = null; // Clear the reference after aborting
    }
  }

  function validateForm(name: string, value: string) {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim() || value.trim().length < 3) {
          error = 'Full name must be at least 3 characters long.';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email is not valid.';
        }
        break;
      case 'confirmEmail':
        if (!value.trim()) {
          error = 'Please confirm your email.';
        } else if (formData.email && value !== formData.email) {
          error = 'Emails do not match.';
        }
        break;
      default:
        break;
    }
    setFormError((prev) => ({ ...prev, [name]: error }));
    return error;
  }

  function validateAllFields() {
    const tempErrors = {
      name: validateForm('name', formData.name),
      email: validateForm('email', formData.email),
      confirmEmail: validateForm('confirmEmail', formData.confirmEmail),
    };
    setFormError(tempErrors);
    return !Object.values(tempErrors).some((error) => error !== '');
  }

  async function handleOnSend() {
    if (!validateAllFields()) {
      return;
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setFormStatus({ isLoading: true });
    const response = await onSend(
      {
        name: formData.name,
        email: formData.email,
      },
      signal,
    );
    setFormStatus({ isLoading: false, ...response });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormStatus({ isLoading: false });
    validateForm(name, value);
  }

  return {
    formData,
    formError,
    formStatus,
    handleChange,
    resetFormData,
    handleOnSend,
  };
}
