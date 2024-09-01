import { Typography, Input } from "@material-tailwind/react";

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  placeholder: string;
}

export function TextInput({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
}: TextInputProps) {
  return (
    <>
      <Typography className="-mb-2" variant="h6">
        {label}
      </Typography>
      <Input
        label={placeholder}
        placeholder={placeholder}
        type="text"
        name={name}
        variant="outlined"
        value={value}
        onChange={onChange}
        size="lg"
        crossOrigin={undefined}
        error={!!error}
      />
      {error ? (
        <Typography
          variant="small"
          color="red"
          className=" flex items-center font-normal"
        >
          {error}
        </Typography>
      ) : null}
    </>
  );
}
