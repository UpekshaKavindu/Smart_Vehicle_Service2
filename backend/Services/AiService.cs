using System.Text;
using System.Text.Json;

namespace Backend.Services
{
    public class AiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public AiService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        private async Task<string> CallAiEndpointAsync(string endpoint, object payload)
        {
            var baseUrl = _config["AiService:BaseUrl"] ?? "http://localhost:8000";
            var url = $"{baseUrl}{endpoint}";
            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode();
            var responseJson = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseJson);
            if (doc.RootElement.TryGetProperty("summary", out var summaryElement))
                return summaryElement.GetString() ?? "No summary returned.";
            return responseJson;
        }

        public async Task<string> GetCustomerSummaryAsync(int customerId, bool includeHistory, bool includeBookings, bool includeMaintenance, string? specificQuestion)
        {
            var payload = new { customer_id = customerId, include_service_history = includeHistory, include_bookings = includeBookings, include_maintenance = includeMaintenance, specific_question = specificQuestion };
            return await CallAiEndpointAsync("/customer/summary", payload);
        }

        public async Task<string> AskQuestionAsync(int customerId, string question, int maxIterations)
        {
            var payload = new { customer_id = customerId, question, max_iterations = maxIterations };
            return await CallAiEndpointAsync("/customer/ask", payload);
        }
    }
}