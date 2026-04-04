import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const buttonVariants = cva(
    "inline-flex max-w-full items-center justify-center gap-2 text-center leading-none whitespace-normal sm:whitespace-nowrap rounded-xl text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    {
        variants: {
            variant: {
                // Primary: Solid yellow background, brown text
                default: "bg-[#f5b400] text-[#2d1f0f] hover:bg-[#ffc933] hover:scale-105 active:scale-95 focus-visible:ring-[#f5b400]",
                destructive:
                    "bg-destructive text-white hover:opacity-90 focus-visible:ring-destructive",
                // Outline: Transparent bg, yellow border, yellow text, fills on hover
                outline:
                    "border-2 border-[#f5b400] bg-transparent text-[#f5b400] hover:bg-[#f5b400] hover:text-[#2d1f0f] hover:scale-105 active:scale-95",
                // Secondary: Brown bg with yellow border and text
                secondary:
                    "bg-[#2d1f0f] text-[#f5b400] border-2 border-[#f5b400] hover:bg-[#4a3520] hover:scale-105 active:scale-95",
                ghost:
                    "text-[#f5b400] hover:bg-[#f5b400] hover:text-[#2d1f0f]",
                link: "text-[#f5b400] underline-offset-4 hover:underline",
            },
            size: {
                default: "min-h-10 px-4 py-2",
                sm: "min-h-8 rounded-lg px-3 py-1.5",
                lg: "min-h-12 rounded-xl px-6 py-3",
                icon: "size-10 rounded-xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
