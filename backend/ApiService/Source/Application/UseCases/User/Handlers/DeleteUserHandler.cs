using CSharpFunctionalExtensions;
using Epam.ItMarathon.ApiService.Application.UseCases.User.Commands;
using Epam.ItMarathon.ApiService.Domain.Abstract;
using Epam.ItMarathon.ApiService.Domain.Shared.ValidationErrors;
using FluentValidation.Results;
using MediatR;
using RoomAggregate = Epam.ItMarathon.ApiService.Domain.Aggregate.Room.Room;

namespace Epam.ItMarathon.ApiService.Application.UseCases.User.Handlers
{
    /// <summary>
    /// Handler for deleting a user from a room.
    /// </summary>
    /// <param name="roomRepository">Implementation of <see cref="IRoomRepository"/> for operating with database.</param>
    public class DeleteUserHandler(IRoomRepository roomRepository)
        : IRequestHandler<DeleteUserRequest, Result<RoomAggregate, ValidationResult>>
    {
        ///<inheritdoc/>
        public async Task<Result<RoomAggregate, ValidationResult>> Handle(DeleteUserRequest request,
            CancellationToken cancellationToken)
        {
            var roomResult = await roomRepository.GetByUserCodeAsync(request.UserCode, cancellationToken);
            if (roomResult.IsFailure)
            {
                return roomResult;
            }

            var room = roomResult.Value;

            var authUser = room.Users.FirstOrDefault(user => user.AuthCode == request.UserCode);
            if (authUser == null)
            {
                return Result.Failure<RoomAggregate, ValidationResult>(new InternalServerError([
                    new ValidationFailure("userCode",
                        "Critical data integrity error: User found by code but missing from room users")
                ]));
            }

            if (!authUser.IsAdmin)
            {
                return Result.Failure<RoomAggregate, ValidationResult>(new NotAuthorizedError([
                    new ValidationFailure("userCode", "You must be an administrator to perform this action")
                ]));
            }

            var userToDelete = room.Users.FirstOrDefault(user => user.Id == request.UserId);
            if (userToDelete == null)
            {
                return Result.Failure<RoomAggregate, ValidationResult>(new BadRequestError([
                    new ValidationFailure("userId", "User to delete not found in the room")
                ]));
            }

            var deleteResult = room.DeleteUser(request.UserId);
            if (deleteResult.IsFailure)
            {
                return Result.Failure<RoomAggregate, ValidationResult>(new BadRequestError([
                    new ValidationFailure(string.Empty, deleteResult.Error.ToString())
                ]));
            }

            var updateResult = await roomRepository.UpdateAsync(room, cancellationToken);
            if (updateResult.IsFailure)
            {
                return Result.Failure<RoomAggregate, ValidationResult>(new NotAuthorizedError([
                    new ValidationFailure(string.Empty, updateResult.Error)
                ]));
            }

            var updatedRoomResult = await roomRepository.GetByUserCodeAsync(request.UserCode, cancellationToken);
            return updatedRoomResult;
        }
    }
}