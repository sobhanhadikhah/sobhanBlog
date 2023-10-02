import { Spinner } from '@phosphor-icons/react';
import { type NextPage } from 'next';

interface Props {
  isLoading?: boolean;
}

const Loading: NextPage<Props> = ({ isLoading = true }) => {
  const container = 'absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center';
  const spinnerStyle = 'animate-spin';
  return isLoading ? (
    <div className={container}>
      <Spinner size={36} className={spinnerStyle} />
    </div>
  ) : null;
};

export default Loading;
