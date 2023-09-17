import { type NextPage } from 'next';
import Link from 'next/link';
import { type ComponentPropsWithRef, type ReactNode } from 'react';

interface Props extends ComponentPropsWithRef<'button'> {
  children: ReactNode;
  to?: string;
}

const Button: NextPage<Props> = ({ children, to, ...props }) => {
  if (to) {
    return (
      <Link href={to}>
        <button {...props} className={`rounded-xl px-2 py-1 ${props.className}`}>
          {children}
        </button>
      </Link>
    );
  }
  return (
    <>
      <button {...props} className={`rounded-xl px-2 py-1 ${props.className}`}>
        {children}
      </button>
    </>
  );
};

export default Button;
