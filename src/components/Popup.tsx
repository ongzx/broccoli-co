import { Dialog } from "@material-tailwind/react";

interface Props {
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function Popup({ isOpen, onClick, children }: Props) {
  return (
    <>
      <Dialog
        size="sm"
        open={isOpen}
        handler={onClick}
        className="bg-transparent shadow-none"
      >
        {children}
      </Dialog>
    </>
  );
}
