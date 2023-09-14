import { type NextPage } from 'next'

interface Props {
    isLoading?: boolean
}

const Loading: NextPage<Props> = ({ isLoading = true }) => {
    const container = "absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center"
    const spinnerStyle = "w-10 h-10 rounded-full border-white border border-b-2 animate-spin"
    return isLoading ? (
        <div className={container} >
            <div className={spinnerStyle} />
        </div>
    ) : null;
}

export default Loading;
