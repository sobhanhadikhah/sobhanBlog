/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function SkeletonLoading() {
  return (
    <SkeletonTheme
                    height={411}
                    baseColor="#202020"
                    highlightColor="#444;">
                    <div className="z-50 col-span-12 h-full rounded-none bg-[#171717] px-3 md:rounded-md">
                      <div className="flex flex-col ">
                        {/* profile auth */}
                        <div className="flex items-center gap-3 text-black dark:text-white ">
                          <div className="flex items-center space-x-3">
                            <div className="group flex items-center gap-1 ">
                              <Skeleton width={32} height={32} style={{ borderRadius: '100%' }} />
                              <div className="flex flex-col items-center gap-1 ">
                                <Skeleton width={100} height={5} />
                                <Skeleton width={100} height={5} />
                              </div>
                            </div>
                          </div>
                          <h4 className="py-3 font-sans text-sm font-bold "></h4>
                          <span className="text-blue-400"> </span>
                        </div>
                        {/* main data */}
                        <div className="dark flex w-full flex-col justify-center ">
                          <h1 className="py-2 text-lg font-extrabold lg:text-xl ">
                            <Skeleton height={8} />
                          </h1>
                          <p className="text-sm font-light leading-relaxed text-gray-400 lg:text-base ">
                            <Skeleton count={3} height={4} />
                          </p>
                        </div>
                      </div>
                    </div>
                  </SkeletonTheme>
  );
}

export default SkeletonLoading;
