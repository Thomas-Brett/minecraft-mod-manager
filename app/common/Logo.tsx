import { FaChessRook } from "react-icons/fa6";

interface Props {
  className?: string;
  size?: string;
}

export default function Logo({ className = "" }: Props) {
  return (
      <FaChessRook className={"text-accent my-2 " + className} />
  );
}