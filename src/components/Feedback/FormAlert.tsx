import { Alert } from 'react-bootstrap';

import { TextAlertContainer } from './styles';

interface FormAlertProps {
  message?: string;
  variant: 'success' | 'danger';
}

export function FormAlert({ message, variant }: FormAlertProps) {
  if (!message) {
    return null;
  }

  const displayMessage = variant === 'danger' ? `Erro! ${message}` : message;

  return (
    <TextAlertContainer>
      <Alert variant={variant}>{displayMessage}</Alert>
    </TextAlertContainer>
  );
}