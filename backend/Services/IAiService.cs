namespace Backend.Services
{
    public interface IAiService
    {
        Task<string> GetCustomerSummaryAsync(int customerId, bool includeHistory, bool includeBookings, bool includeMaintenance, string? specificQuestion);
        Task<string> AskQuestionAsync(int customerId, string question, int maxIterations);
    }
}