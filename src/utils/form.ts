import { FieldErrors, FieldValues, Path } from 'react-hook-form';

export function getFieldErrorMessage<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  field: Path<TFieldValues>,
) {
  const error = errors[field];
  return error?.message;
}