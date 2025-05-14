"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  className?: string;
}

export const Dropdown = ({
  value,
  options,
  onChange,
  className,
}: DropdownProps) => {
  const selected = options.find((o) => o.value === value);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md bg-background hover:bg-muted transition",
            className
          )}
        >
          {selected?.label || "Select"}
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="z-50 mt-2 w-full rounded-md border bg-popover shadow-lg p-1"
        sideOffset={4}
      >
        {options.map((option) => (
          <DropdownMenu.Item
            key={option.value}
            onSelect={() => onChange(option.value)}
            className={cn(
              "cursor-pointer px-3 py-2 text-sm rounded-md transition-colors",
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
