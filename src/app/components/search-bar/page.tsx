"use client"

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import React from "react";

interface ICommandProps {
  commands: { value: string; label: string }[];
}

export default function SearchBar({ commands }: ICommandProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleValueChange = (value: string) => {
    setInputValue(value);
    setOpen(!!value);
  };

  const filteredCommands = Array.isArray(commands)
    ? commands.filter((command) =>
        command.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];
  console.log("filteredCommands", filteredCommands);
  return (
    <div className="relative w-full">
      <Command className="rounded-lg border shadow-md w-full my-1">
        <CommandInput
          placeholder="Search for items..."
          onValueChange={handleValueChange}
        />
        {open && filteredCommands.length > 0 && (
          <div className="absolute left-0 top-full z-50 w-full border rounded-lg shadow-lg bg-popover mt-1">
            <CommandList>
              {filteredCommands.map((command) => (
                <CommandItem key={command.value} value={command.value}>
                  {command.label}
                </CommandItem>
              ))}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}
