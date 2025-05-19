"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  className?: string;
  trigger: ReactNode;
}

export const Dropdown = ({
  value,
  options,
  onChange,
  trigger,
  className,
}: DropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Content
        className={cn(
          "z-50 mt-2 w-full rounded-md border bg-popover shadow-lg p-1",
          className
        )}
        sideOffset={4}
      >
        {options.map((option) => (
          <DropdownMenu.Item
            key={option.value}
            onSelect={() => onChange(option.value)}
            className={cn(
              "cursor-pointer px-2 py-2 text-sm rounded-md transition-colors",
              option.value === value
                ? "bg-accent text-accent-foreground"
                : "hover:bg-muted"
            )}
          >
            {option.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
