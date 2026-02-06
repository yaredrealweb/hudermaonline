"use client";

import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full border-slate-600 hover:bg-slate-800 bg-transparent"
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-slate-800 border-slate-700"
      >
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={language === "en" ? "bg-blue-600" : ""}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("am")}
          className={language === "am" ? "bg-blue-600" : ""}
        >
          አማርኛ (Amharic)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("or")}
          className={language === "or" ? "bg-blue-600" : ""}
        >
          Afaan Oromo (Oromifa)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("af")}
          className={language === "af" ? "bg-blue-600" : ""}
        >
          Afar (Afaar)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("so")}
          className={language === "so" ? "bg-blue-600" : ""}
        >
          Somali
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
