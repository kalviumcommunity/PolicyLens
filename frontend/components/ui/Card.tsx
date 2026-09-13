import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "article" | "section";
  children: ReactNode;
};

export function Card({ className = "", children, as = "div", ...rest }: Props) {
  const Comp = as as "div";
  return (
    <Comp
      className={[
        "rounded-3xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur",
        "dark:border-slate-800 dark:bg-slate-950/75",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function CardHeader({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["flex flex-col gap-1 p-6 sm:p-8 pb-0", className].join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardBody({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-6 sm:p-8", className].join(" ")} {...rest}>
    {children}
  </div>;
}

export function CardFooter({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["flex flex-col gap-2 p-6 sm:p-8 pt-0", className].join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardDivider({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      className={["border-t border-slate-200 dark:border-slate-800 my-4", className].join(" ")}
      {...rest}
    />
  );
}
