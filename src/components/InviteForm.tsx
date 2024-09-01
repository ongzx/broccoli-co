import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { TextInput } from "./TextInput";
import { InitialState, InitialFormStatus } from "../types";
import React from "react";

interface Props {
  formData: InitialState;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleOnSend: () => void;
  formStatus: InitialFormStatus;
  formError: InitialState;
}

export function InviteForm({
  formData,
  handleChange,
  handleOnSend,
  formStatus,
  formError,
}: Props) {
  return (
    <Card className="mx-auto w-full max-w-[48rem]">
      <CardBody className="flex flex-col gap-3">
        <Typography variant="h4" color="indigo" className="text-center">
          Be the first to know
        </Typography>
        <Typography variant="small" color="blue-gray" className="text-center">
          Sign up to find out when we launch our service.
        </Typography>
        <Typography variant="small" color="blue-gray" className="text-center">
          It&apos;s coming very soon!
        </Typography>
        <TextInput
          label="Your name"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={formError.name}
        />
        <TextInput
          label="Your Email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={formError.email}
        />
        <TextInput
          label="Confirm Your Email"
          placeholder="Confirm Email"
          name="confirmEmail"
          value={formData.confirmEmail}
          onChange={handleChange}
          error={formError.confirmEmail}
        />
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          data-testid="submit-btn"
          disabled={formStatus.isLoading}
          variant="gradient"
          color="indigo"
          onClick={handleOnSend}
          fullWidth
          className="flex justify-center"
          loading={formStatus.isLoading}
        >
          Keep me posted
        </Button>

        {formStatus.status === "err" && formStatus.errorMessage ? (
          <Typography
            variant="paragraph"
            color="red"
            className="text-center py-2"
          >
            {formStatus.errorMessage}
          </Typography>
        ) : null}
      </CardFooter>
    </Card>
  );
}
