import Modal from "../modal/Modal";
import type { DeleteUserModalProps } from "./types";

const DeleteUserModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  participant,
  isLoading = false,
}: DeleteUserModalProps) => {
  const handleConfirm = () => {
    onConfirm(participant);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Delete confirmation"
      description=""
      iconName="trash"
      withConfirm
      isLoading={isLoading}
    >
      <div className="">
        <p className="">
          Are you sure you want to delete
          <b> {participant.firstName + " " + participant.lastName}</b> ?
        </p>
      </div>
    </Modal>
  );
};

export default DeleteUserModal;
