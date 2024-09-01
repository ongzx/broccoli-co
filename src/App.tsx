import { useState } from "react";
import { Popup } from "./components/Popup";
import { InviteForm } from "./components/InviteForm";
import { sendInvitation } from "./api/sendInvitation";
import { useFormData } from "./hooks/useFormData";
import { SuccessForm } from "./components/SuccessForm";
import { Button, Typography } from "@material-tailwind/react";

function App() {
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const {
    handleChange,
    handleOnSend,
    formStatus,
    formData,
    formError,
    resetFormData,
  } = useFormData({
    onSend: sendInvitation,
  });

  function triggerPopup() {
    setOpenPopup(!openPopup);
    resetFormData();
  }

  return (
    <div className="flex flex-col h-screen bg-[url('./assets/background.webp')]">
      <header className="py-5 bg-white bg-opacity-15">
        <div className="container mx-auto px-4">
          <Typography variant="h6" color="white">
            Broccoli & Co
          </Typography>
        </div>
      </header>
      <main className="flex h-screen text-center items-center justify-center">
        <div className="container mx-auto px-6">
          <Typography variant="h1" color="white" className="my-4">
            A better way to enjoy every day.
          </Typography>
          <Typography variant="paragraph" color="white" className="my-4">
            Join our early access list and be the first to enjoy our new
            service, saving you time and money.
          </Typography>
          <Button color="indigo" className="my-4" onClick={triggerPopup}>
            Request an invite
          </Button>
          <Popup isOpen={openPopup} onClick={triggerPopup}>
            {formStatus.status === "ok" ? (
              <SuccessForm onClick={triggerPopup} />
            ) : (
              <InviteForm
                handleChange={handleChange}
                formData={formData}
                formError={formError}
                handleOnSend={handleOnSend}
                formStatus={formStatus}
              />
            )}
          </Popup>
        </div>
      </main>
      <footer className="py-5 bg-white bg-opacity-15 text-center text-white">
        <div className="container mx-auto px-6">
          <Typography variant="small" color="white">
            © 2024 Broccoli & Co. All Rights Reserved.
            <br />
            Made with ❤️ in Singapore.
          </Typography>
        </div>
      </footer>
    </div>
  );
}

export default App;
