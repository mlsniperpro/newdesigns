import classNames from "classnames";
import { TopicInterface } from "./Topic";

const Topic = ({
  topic,
  className,
}: {
  topic: TopicInterface;
  className: string;
}) => {
  const { icon, title, backgroundColor, textColor } = topic;
  const containerClasses = classNames(
    "flex",
    "space-x-2",
    "items-center",
    backgroundColor,
    `border border-${backgroundColor}`,
    "xl:px-3 px-2",
    "py-2",
    "rounded-[16px]",
    className
  );

  const textClasses = classNames(`text-${textColor} text-xs xl:text-sm`);
  return (
    <div className={containerClasses}>
      <div className="text-xs xl:text-sm">{icon}</div>
      <p className={textClasses}>{title}</p>
    </div>
  );
};

export default Topic;
