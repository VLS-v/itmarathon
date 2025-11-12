import type { Participant } from "@types/api";

export interface DeleteUserModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: (participant: Participant) => void;
  participant: Participant;
  isLoading?: boolean;
}
