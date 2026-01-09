import { ErrorMessage } from './styles';

interface FormFieldErrorProps {
  message?: string;
}

export function FormFieldError({ message }: FormFieldErrorProps) {
  if (!message) {
    return null;
  }

  return <ErrorMessage>{message}</ErrorMessage>;
}