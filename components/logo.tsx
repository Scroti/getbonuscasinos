import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    titleSize?: string;
    subtitleSize?: string;
}

export const Logo = ({
    className,
    titleSize = "text-5xl",
    subtitleSize = "text-base"
}: LogoProps) => {
    return (
        <div className={cn("flex flex-col items-center leading-none font-poppins w-fit", className)}>
            <p className={cn("font-bold text-white tracking-[-0.02em]", titleSize)}>
                getbonus
            </p>
            <p className={cn("font-extrabold uppercase tracking-[0.2em] bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-500 dark:to-red-500 bg-clip-text text-transparent", subtitleSize)}>
                CASINOS
            </p>
        </div>
    );
};
