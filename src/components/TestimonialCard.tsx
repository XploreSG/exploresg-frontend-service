import React from "react";

type Props = {
  quote: string;
  name: string;
  title?: string; // role | company
  avatarUrl?: string;
};

const TestimonialCard: React.FC<Props> = ({
  quote,
  name,
  title,
  avatarUrl,
}) => {
  return (
    <div className="flex h-auto">
      <div className="flex flex-col rounded-xl bg-white">
        <div className="flex-auto p-4 md:p-6">
          <p className="text-base text-gray-800 italic md:text-lg">“{quote}”</p>
        </div>

        <div className="rounded-b-xl bg-gray-100 p-4 md:px-7">
          <div className="flex items-center gap-x-3">
            <div className="shrink-0">
              {avatarUrl ? (
                <img
                  className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
                  src={avatarUrl}
                  alt={`${name} avatar`}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700 sm:h-12 sm:w-12">
                  {name
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
            </div>

            <div className="grow text-left">
              <p className="text-sm font-semibold text-gray-800 sm:text-base">
                {name}
              </p>
              {title && <p className="text-xs text-gray-500">{title}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
