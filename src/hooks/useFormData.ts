import { useRef, useState } from "react";
import { InitialState, InitialFormStatus } from "../types";

const initialState: InitialState = {
  name: "",
  email: "",
  confirmEmail: "",
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

/**
 * The useFormData hook manages form data, form validation, 
 * and submission status for a form that requires a name and email confirmation. 
 * It provides utility functions to handle input changes, 
 * validate form data, submit the form, and reset the form state. 
 * This hook also supports cancelling ongoing API requests 
 * using AbortController to prevent memory leaks or unwanted operations.
 * @param param0 {onSend}: api function
 * @returns
 */
export function useFormData({ onSend }: Props) {
  const [formData, setFormData] = useState<InitialState>(initialState);
  const [formError, setFormError] = useState<InitialState>(initialState);
  const [formStatus, setFormStatus] =
    useState<InitialFormStatus>(initialFormStatus); // indicate form submit status
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Resets formData, formError, and formStatus to their initial values.
   * Cancels any ongoing API requests by calling abortControllerRef.current.abort()
   * and clears the abort controller reference.
   * Called when user close popup
   */
  function resetFormData() {
    setFormData(initialState);
    setFormError(initialState);
    setFormStatus(initialFormStatus);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel any ongoing request
      abortControllerRef.current = null; // Clear the reference after aborting
    }
  }

  /**
   * Validates the form field based on the name and value parameters.
   * @param name
   * @param value
   * @returns error (string)
   */
  function validateForm(name: string, value: string) {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim() || value.trim().length < 3) {
          error = "Full name must be at least 3 characters long.";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email is not valid.";
        }
        break;
      case "confirmEmail":
        if (!value.trim()) {
          error = "Please confirm your email.";
        } else if (formData.email && value !== formData.email) {
          error = "Emails do not match.";
        }
        break;
      default:
        break;
    }
    setFormError((prev) => ({ ...prev, [name]: error }));
    return error;
  }

  /**
   * Validates all form fields (name, email, confirmEmail).
   * Returns true if all fields are valid, false otherwise.
   * @returns boolean
   */
  function validateAllFields() {
    const tempErrors = {
      name: validateForm("name", formData.name),
      email: validateForm("email", formData.email),
      confirmEmail: validateForm("confirmEmail", formData.confirmEmail),
    };
    setFormError(tempErrors);
    return !Object.values(tempErrors).some((error) => error !== "");
  }

  /**
   * If validation passes, it creates a new AbortController,
   * triggers the onSend function, and updates the formStatus based on the response.
   * @returns
   */
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

  /**
   * Handles input field changes by updating formData and
   * triggering validation for the changed field.
   * @param event
   */
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
