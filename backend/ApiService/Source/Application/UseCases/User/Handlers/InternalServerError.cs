using FluentValidation.Results;

namespace Epam.ItMarathon.ApiService.Domain.Shared.ValidationErrors
{
    /// <summary>
    /// Represents an "Internal Server" error.
    /// </summary>
    public class InternalServerError(IEnumerable<ValidationFailure> failures) : ValidationResult(failures);
}