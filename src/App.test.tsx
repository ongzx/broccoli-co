import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { sendInvitation } from "./api/sendInvitation";

// Mock the sendInvitation API function
jest.mock("./api/sendInvitation", () => ({
  sendInvitation: jest.fn(),
}));

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the main content and the "Request an invite" button', () => {
    render(<App />);

    expect(
      screen.getByText(/A better way to enjoy every day./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Join our early access list/i)).toBeInTheDocument();
    expect(screen.getByText(/Request an invite/i)).toBeInTheDocument();
  });

  it('should open the popup when the "Request an invite" button is clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByText(/Request an invite/i));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Your Name/i)).toBeInTheDocument();
  });

  it("should close the popup when the close button is clicked", () => {
    render(<App />);

    fireEvent.click(screen.getByText(/Request an invite/i));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should submit the form and show success message on success", async () => {
    (sendInvitation as jest.Mock).mockResolvedValue({ status: "ok" });

    render(<App />);

    fireEvent.click(screen.getByText(/Request an invite/i));

    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.click(screen.getByTestId("submit-btn"));

    waitFor(() => {
      expect(sendInvitation).toHaveBeenCalledWith(
        { name: "John Doe", email: "john@example.com" },
        expect.any(AbortSignal),
      );
      expect(
        screen.getByText(/Thank You for Joining Us!/i),
      ).toBeInTheDocument();
    });
  });

  it("should reset the form and close the popup after a successful submission", async () => {
    (sendInvitation as jest.Mock).mockResolvedValue({ status: "ok" });

    render(<App />);

    fireEvent.click(screen.getByText(/Request an invite/i));

    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.click(screen.getByTestId("submit-btn"));

    waitFor(() => {
      expect(
        screen.getByText(/Thank You for Joining Us!/i),
      ).toBeInTheDocument();
    });

    fireEvent.mouseDown(document.body);

    waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      fireEvent.click(screen.getByText(/Request an invite/i));
      expect(screen.getByPlaceholderText(/Full Name/i)).toHaveValue("");
    });
  });
});
