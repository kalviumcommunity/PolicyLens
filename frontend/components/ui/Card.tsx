import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  variant?: "default" | "outline" | "ghost";
  hoverable?: boolean;
  children?: ReactNode;
};

export const Card = forwardRef<HTMLElement, CardProps>(
  (
    {
      className,
      children,
      as: Comp = "div",
      variant = "default",
      hoverable = false,
      ...rest
    },
    ref
  ) => {
    const variantStyles = {
      default:
        "border border-slate-200 bg-white/80 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/75",
      outline: "border border-slate-200 bg-transparent dark:border-slate-800",
      ghost: "bg-slate-100/50 dark:bg-slate-900/50",
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          "overflow-hidden rounded-3xl transition-all duration-200",
          variantStyles[variant],
          hoverable &&
            "hover:-translate-y-0.5 hover:shadow-md dark:hover:border-slate-700",
          className
        )}
        {...rest}
      >
        {children}
      </Comp>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1.5 p-6 sm:p-8 pb-0", className)}
      {...rest}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "h4" }
>(({ className, children, as: Tag = "h3", ...rest }, ref) => (
  <Tag
    ref={ref}
    className={cn(
      "text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50",
      className
    )}
    {...rest}
  >
    {children}
  </Tag>
));
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...rest }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
    {...rest}
  >
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...rest }, ref) => (
    <div ref={ref} className={cn("p-6 sm:p-8", className)} {...rest}>
      {children}
    </div>
  )
);
CardBody.displayName = "CardBody";

export const CardContent = CardBody; // Alias for flexibility

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-3 p-6 sm:p-8 pt-0",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";

export const CardAction = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...rest}
    >
      {children}
    </div>
  )
);
CardAction.displayName = "CardAction";

export const CardBadge = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  )
);
CardBadge.displayName = "CardBadge";

export const CardImage = forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ src, alt = "", className, ...rest }, ref) => (
  <div className={cn("relative aspect-video w-full overflow-hidden", className)}>
    <img
      ref={ref}
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      {...rest}
    />
  </div>
));
CardImage.displayName = "CardImage";

export const CardDivider = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      className={cn(
        "border-t border-slate-200 dark:border-slate-800",
        className
      )}
      {...rest}
    />
  )
);
CardDivider.displayName = "CardDivider";

export const CardGrid = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}
      {...rest}
    >
      {children}
    </div>
  )
);
CardGrid.displayName = "CardGrid";