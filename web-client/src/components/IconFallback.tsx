interface Props {
  word: string;
  size?: "lg" | "sm";
  onClick?: () => void;
}

const IconFallback = ({ word, size = "lg", onClick }: Props) => {
  return (
    <div
      className={`bg-tertiary rounded-full flex justify-center items-center select-none ${
        size == "lg" ? "h-24 w-24" : "h-10 w-10"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <span
        className={`text-secondary font-semibold ${
          size == "lg" ? "text-5xl" : "text-lg"
        }`}
        onClick={onClick}
      >
        {word.at(0)?.toUpperCase()}
      </span>
    </div>
  );
};

export default IconFallback;
