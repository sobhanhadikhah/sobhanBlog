/* eslint-disable prettier/prettier */

import { sortButtons } from "~/utils/contents";

type Props = {
    setSort:CallableFunction,
    sort:string
};

function Sort({setSort,sort}: Props) {
  return (
    <div className="col-span-12 flex    gap-5  px-3 py-3 text-lg md:text-xl">
            {sortButtons.map((item) => (
              <button
                key={item.id}
                onClick={()=> void setSort(item.value)}
                className={`${item.value === sort ? 'font-semibold text-white' : 'text-white/75'}`}>
                {item.label}
              </button>
            ))}
          </div>
  );
}

export default Sort;
