"use client";

import { useFormStatus } from "react-dom";

type AccessSubmitButtonProps = {
  children: string;
  pendingText: string;
  variant: "filled" | "outline";
};

export function AccessSubmitButton({
  children,
  pendingText,
  variant,
}: AccessSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`secondary-button ${variant} pending-button`}
      type="submit"
      disabled={pending}
    >
      <span>{pending ? pendingText : children}</span>
    </button>
  );
}
