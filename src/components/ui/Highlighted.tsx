import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const Highlighted = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode | string;
  className?: string;
}): JSX.Element => {
  return (
    <span
      className={twMerge(
        clsx(
          "text-bold inline-flex px-[6px] py-[2px] text-xl font-extrabold text-white underline",
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
