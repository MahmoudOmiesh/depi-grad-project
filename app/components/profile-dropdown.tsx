"use client";

import { LogOutIcon, Monitor, Moon, PaletteIcon, Sun } from "lucide-react";
import { AvatarWithFallback } from "./avatar-with-fallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { authClient } from "~/lib/auth-client";
import { useTheme } from "./theme-provider";
import { useNavigate } from "react-router";

export function ProfileDropdown({
  name,
  email,
  photoUrl,
  className,
}: {
  name: string;
  email: string;
  photoUrl: string;
  className?: string;
}) {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <AvatarWithFallback src={photoUrl} className={className} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup className="p-1">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-muted-foreground line-clamp-1 text-xs">{email}</p>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <PaletteIcon className="text-muted-foreground size-4" />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="size-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="size-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="size-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={async () => {
              await Promise.all([authClient.signOut(), navigate("/")]);
            }}
          >
            <LogOutIcon />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
