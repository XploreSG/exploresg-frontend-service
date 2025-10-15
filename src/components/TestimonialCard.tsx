import React from "react";

type Props = {
  quote: string;
  name: string;
  title?: string; // role | company
  avatarUrl?: string;
  className?: string;
};

const TestimonialCard: React.FC<Props> = ({
  quote,
  name,
  title,
  avatarUrl,
  className,
}) => {
  return (
    <div className={"h-full overflow-hidden " + (className ?? "")}>
      <div className="flex h-full flex-col rounded-xl bg-white">
        <div className="flex-auto overflow-hidden p-3 sm:p-4 md:p-6">
          <p
            className="break-words text-gray-800 italic"
            style={{
              fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
              lineHeight: "1.6",
            }}
          >
            "{quote}"
          </p>
        </div>

        <div className="rounded-b-xl bg-gray-100 p-3 sm:p-4 md:px-7">
          <div className="flex items-center gap-x-2 sm:gap-x-3">
            <div className="shrink-0">
              {avatarUrl ? (
                <img
                  className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10 md:h-12 md:w-12"
                  src={avatarUrl}
                  alt={`${name} avatar`}
                />
              ) : (
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700 sm:h-10 sm:w-10 md:h-12 md:w-12"
                  style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
                >
                  {name
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
            </div>

            <div className="grow text-left">
              <p
                className="font-semibold text-gray-800"
                style={{ fontSize: "clamp(0.8125rem, 1.5vw, 0.9375rem)" }}
              >
                {name}
              </p>
              {title && (
                <p
                  className="text-gray-500"
                  style={{ fontSize: "clamp(0.6875rem, 1.5vw, 0.75rem)" }}
                >
                  {title}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
