"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface SecretInputProps {
  value: string;
  onChange: (value: string) => void;
  expectedInput: string;
  className?: string;
  disabled?: boolean;
}

export function SecretInput({
  expectedInput,
  className,
  value,
  onChange,
  disabled,
}: SecretInputProps) {
  const splittedInput: string[] = expectedInput.split(" ");
  const lengthWithoutSpaces = expectedInput.replace(/\s+/g, "").length;
  let indexCounter = 0;

  return (
    <InputOTP
      className={className}
      value={value}
      disabled={disabled}
      onChange={onChange}
      maxLength={lengthWithoutSpaces}
    >
      {splittedInput.map((group, groupIndex) => (
        <div className="flex items-center gap-2" key={`secret-${groupIndex}`}>
          <InputOTPGroup>
            {group.split("").map((_, charIndex) => (
              <InputOTPSlot
                className="border-gray-400 font-mono font-semibold text-black dark:text-white"
                key={`secret-input-${groupIndex}-${charIndex}`}
                index={indexCounter++}
              />
            ))}
          </InputOTPGroup>
          {/* {groupIndex !== splittedInput.length - 1 ? (
            <InputOTPSeparator />
          ) : null} */}
        </div>
      ))}
    </InputOTP>
  );
}
