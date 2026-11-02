"use client"

import { routingHandeler } from "@/shad-components/nav-user";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shad-components/ui/command"
import { Badge } from "@/shad-components/ui/badge";
import { IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface ICommandProps {
  commands: { value: string; label: string; gameTitle: string }[];
}

export default function SearchBar({ commands }: ICommandProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const game = searchParams.get("game");

  const clearGame = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("game");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleValueChange = (value: string) => {
    setInputValue(value);
    setOpen(!!value);
  };

  const filteredCommands = Array.isArray(commands)
    ? commands.filter((command) =>
        (!game || command.gameTitle === game) &&
        command.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];
  return (
    <div className="relative w-full">
      {game && (
        <Badge variant="secondary" className="absolute right-3 top-1/2 z-10 -translate-y-1/2 gap-1">
          {game}
          <button type="button" aria-label={`Clear ${game} filter`} onClick={clearGame} className="cursor-pointer">
            <IconX />
          </button>
        </Badge>
      )}
      <Command className="rounded-lg border shadow-md w-full my-1">
        <CommandInput
          placeholder="Search for items..."
          onValueChange={handleValueChange}
        />
        {open && filteredCommands.length > 0 && (
          <div className="absolute left-0 top-full z-50 w-full border rounded-lg shadow-lg bg-popover mt-1">
            <CommandList>
              {filteredCommands.map((command) => (
                <CommandItem key={command.value} value={command.value} onSelect={() => routingHandeler("/item-card/" + command.value)}>
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
