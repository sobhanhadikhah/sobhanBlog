import { Spinner } from '@phosphor-icons/react';
import { type NextPage } from 'next';
import Link from 'next/link';
import { type ComponentPropsWithRef, type ReactNode } from 'react';

interface Props extends ComponentPropsWithRef<'button'> {
  children: ReactNode;
  to?: string;
  isLoading?: boolean;
}

const Button: NextPage<Props> = ({ children, to, isLoading, ...props }) => {
  if (to) {
    return (
      <Link href={to}>
        <button {...props} className={`px-2 py-1 ${props.className}`}>
          {children}
        </button>
      </Link>
    );
  }
  return (
    <>
      <button {...props} className={`px-2 py-1 ${props.className}`}>
        {isLoading ? (
          <div className=" flex items-center justify-center text-center ">
            <Spinner className="animate-spin" size={26} />{' '}
          </div>
        ) : (
          children
        )}
      </button>
    </>
  );
};

export default Button;
