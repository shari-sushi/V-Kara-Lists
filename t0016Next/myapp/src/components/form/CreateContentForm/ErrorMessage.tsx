import { FieldError, useForm } from "react-hook-form"

type ErrorMessageProps = {
  errorField: FieldError | undefined
}

export const ErrorMessage = ({ errorField }: ErrorMessageProps) => {
  return <span className="text-red-500">{errorField?.message}</span>
}
