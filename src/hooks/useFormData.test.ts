import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { useFormData } from "./useFormData";

const mockOnSend = jest.fn();

describe("useFormData Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with the correct initial state", () => {
    const { result } = renderHook(() => useFormData({ onSend: mockOnSend }));

    expect(result.current.formData).toEqual({
      name: "",
      email: "",
      confirmEmail: "",
    });
    expect(result.current.formError).toEqual({
      name: "",
      email: "",
      confirmEmail: "",
    });
    expect(result.current.formStatus).toEqual({
      isLoading: false,
    });
  });

  it("should update form data and validate input", () => {
    const { result } = renderHook(() => useFormData({ onSend: mockOnSend }));

    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "John Doe" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.name).toBe("John Doe");
    expect(result.current.formError.name).toBe("");

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "invalidemail" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.email).toBe("invalidemail");
    expect(result.current.formError.email).toBe("Email is not valid.");
  });

  it("should not submit when form validation fails", async () => {
    const { result } = renderHook(() => useFormData({ onSend: mockOnSend }));

    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "Jo" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({
        target: { name: "email", value: "invalidemail" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({
        target: { name: "confirmEmail", value: "invalidemail" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleOnSend();
    });

    expect(mockOnSend).not.toHaveBeenCalled();
    expect(result.current.formStatus.isLoading).toBe(false);
  });

  it("should set loading status and call onSend on valid submit", async () => {
    mockOnSend.mockResolvedValue({ status: "ok" });
    const { result } = renderHook(() => useFormData({ onSend: mockOnSend }));

    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "John Doe" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "john@example.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "confirmEmail", value: "john@example.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      result.current.handleOnSend();
    });

    await waitFor(() => {
      expect(mockOnSend).toHaveBeenCalledWith(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        expect.any(AbortSignal),
      );
      expect(result.current.formStatus.isLoading).toBe(false);
      expect(result.current.formStatus.status).toBe("ok");
    });
  });

  it("should handle API errors", async () => {
    mockOnSend.mockResolvedValue({ status: "err" });
    const { result } = renderHook(() => useFormData({ onSend: mockOnSend }));

    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "John Doe" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "john@example.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "confirmEmail", value: "john@example.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      result.current.handleOnSend();
    });

    await waitFor(() => {
      expect(result.current.formStatus.isLoading).toBe(false);
      expect(result.current.formStatus.status).toBe("err");
    });
  });

  it("should cancel the API request when resetFormData is called", async () => {
    mockOnSend.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ status: "ok" }), 500),
        ),
    );
    const { result } = renderHook(() => useFormData({ onSend: mockOnSend }));

    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "John Doe" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "john@example.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "confirmEmail", value: "john@example.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleOnSend();
    });

    expect(result.current.formStatus.isLoading).toBe(true);

    act(() => {
      result.current.resetFormData();
    });

    await waitFor(() => {
      expect(result.current.formStatus.isLoading).toBe(false);
      expect(result.current.formStatus.status).toBe(undefined); // Status should be reset
    });

    expect(mockOnSend).toHaveBeenCalledWith(
      {
        name: "John Doe",
        email: "john@example.com",
      },
      expect.any(AbortSignal),
    );
    expect(mockOnSend.mock.results[0].value).resolves.toEqual({ status: "ok" });
  });
});
