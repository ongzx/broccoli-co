import { Button, Card, CardBody, Typography } from "@material-tailwind/react";

interface Props {
  onClick: () => void;
}

export function SuccessForm({ onClick }: Props) {
  return (
    <Card className="mx-auto w-full max-w-[48rem]">
      <CardBody className="flex flex-col gap-4">
        <Typography variant="h4" color="indigo" className="text-center">
          Thank You for Joining Us!
        </Typography>
        <Typography variant="small" color="blue-gray" className="text-center">
          You&apos;re officially on the list! <br />
          We&apos;re thrilled to have you as part of our early community.
        </Typography>
        <Typography variant="small" color="blue-gray" className="text-center">
          We&apos;ll keep you updated with the latest news and you&apos;ll be
          the first to know when we launch.
        </Typography>
        <Button
          variant="gradient"
          color="indigo"
          onClick={onClick}
          fullWidth
          className="flex justify-center"
        >
          Okay
        </Button>
      </CardBody>
    </Card>
  );
}
