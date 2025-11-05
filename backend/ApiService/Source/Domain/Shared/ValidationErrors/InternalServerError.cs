using FluentValidation.Results;

namespace Epam.ItMarathon.ApiService.Application.UseCases.User.Handlers
{
    internal class InternalServerError : ValidationResult
    {
        private object value;

        public InternalServerError(object value)
        {
            this.value = value;
        }
    }
}