import IconButton from "../icon-button/IconButton";
import type { DeleteButtonProps } from "./types";
import "./DeleteButton.scss";

const DeleteButton = ({ onClick }: DeleteButtonProps) => {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <div className="copy-button">
      <IconButton iconName="trash" color="green" onClick={handleClick} />
    </div>
  );
};

export default DeleteButton;
