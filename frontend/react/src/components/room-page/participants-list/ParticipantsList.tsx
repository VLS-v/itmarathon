import { useState } from "react";
import { useParams } from "react-router";
import ParticipantCard from "@components/common/participant-card/ParticipantCard";
import ParticipantDetailsModal from "@components/common/modals/participant-details-modal/ParticipantDetailsModal";
import type { Participant } from "@types/api";
import {
  BASE_API_URL,
  MAX_PARTICIPANTS_NUMBER,
  generateParticipantLink,
} from "@utils/general";
import { type ParticipantsListProps, type PersonalInformation } from "./types";
import "./ParticipantsList.scss";
import DeleteUserModal from "@components/common/modals/delete-user-modal/DeleteUserModal";

const ParticipantsList = ({
  participants,
  onParticipantDeleted,
}: ParticipantsListProps) => {
  const { userCode } = useParams();
  const [selectedParticipant, setSelectedParticipant] =
    useState<PersonalInformation | null>(null);
  const [selectedParticipantToDelete, setSelectedParticipantToDelete] =
    useState<Participant | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const admin = participants?.find((participant) => participant?.isAdmin);
  const restParticipants = participants?.filter(
    (participant) => !participant?.isAdmin,
  );

  const isParticipantsMoreThanTen = participants.length > 10;

  const handleInfoButtonClick = (participant: Participant) => {
    const personalInfoData: PersonalInformation = {
      firstName: participant.firstName,
      lastName: participant.lastName,
      phone: participant.phone,
      deliveryInfo: participant.deliveryInfo,
      email: participant.email,
      link: generateParticipantLink(participant.userCode),
    };
    setSelectedParticipant(personalInfoData);
  };

  const handleModalClose = () => setSelectedParticipant(null);

  const handleDeleteUserButtonClick = (participant: Participant) => {
    setSelectedParticipantToDelete(participant);
  };

  const handleDeleteUserCancel = () => {
    if (isDeleting) return;
    setSelectedParticipantToDelete(null);
  };

  const handleDeleteUserConfirm = async (participant: Participant) => {
    if (!participant || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${BASE_API_URL}/api/users/${participant.id}?userCode=${userCode}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete participant");
      }

      onParticipantDeleted?.();

      setSelectedParticipantToDelete(null);
    } catch (error) {
      console.error("Error deleting participant:", error);
      alert("Failed to delete participant. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`participant-list ${isParticipantsMoreThanTen ? "participant-list--shift-bg-image" : ""}`}
    >
      <div
        className={`participant-list__content ${isParticipantsMoreThanTen ? "participant-list__content--extra-padding" : ""}`}
      >
        <div className="participant-list-header">
          <h3 className="participant-list-header__title">Who’s Playing?</h3>

          <span className="participant-list-counter__current">
            {participants?.length ?? 0}/
          </span>

          <span className="participant-list-counter__max">
            {MAX_PARTICIPANTS_NUMBER}
          </span>
        </div>

        <div className="participant-list__cards">
          {admin ? (
            <ParticipantCard
              key={admin?.id}
              firstName={admin?.firstName}
              lastName={admin?.lastName}
              isCurrentUser={userCode === admin?.userCode}
              isAdmin={admin?.isAdmin}
              isCurrentUserAdmin={userCode === admin?.userCode}
              adminInfo={`${admin?.phone}${admin?.email ? `\n${admin?.email}` : ""}`}
              participantLink={generateParticipantLink(admin?.userCode)}
            />
          ) : null}

          {restParticipants?.map((user) => (
            <ParticipantCard
              key={user?.id}
              firstName={user?.firstName}
              lastName={user?.lastName}
              isCurrentUser={userCode === user?.userCode}
              isCurrentUserAdmin={userCode === admin?.userCode}
              participantLink={generateParticipantLink(user?.userCode)}
              onInfoButtonClick={
                userCode === admin?.userCode && userCode !== user?.userCode
                  ? () => handleInfoButtonClick(user)
                  : undefined
              }
              onDeleteUserButtonClick={() => handleDeleteUserButtonClick(user)}
            />
          ))}
        </div>

        {selectedParticipant ? (
          <ParticipantDetailsModal
            isOpen={!!selectedParticipant}
            onClose={handleModalClose}
            personalInfoData={selectedParticipant}
          />
        ) : null}

        {selectedParticipantToDelete ? (
          <DeleteUserModal
            isOpen={!!selectedParticipantToDelete}
            onClose={handleDeleteUserCancel}
            onConfirm={handleDeleteUserConfirm}
            participant={selectedParticipantToDelete}
            isLoading={isDeleting}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ParticipantsList;
