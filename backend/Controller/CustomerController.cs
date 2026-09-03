using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly IAiService _aiService;

        public CustomerController(ICustomerService customerService, IAiService aiService)
        {
            _customerService = customerService;
            _aiService = aiService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search)
        {
            var customers = await _customerService.SearchAsync(search);
            return Ok(customers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var customer = await _customerService.GetByIdAsync(id);
            if (customer == null)
                return NotFound($"Customer with ID {id} not found.");
            return Ok(customer);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CustomerCreateDto dto)
        {
            try
            {
                var created = await _customerService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while creating the customer." });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CustomerUpdateDto dto)
        {
            try
            {
                var updated = await _customerService.UpdateAsync(id, dto);
                if (updated == null)
                    return NotFound($"Customer with ID {id} not found.");
                return Ok(updated);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while updating the customer." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _customerService.DeleteAsync(id);
            if (!deleted)
                return NotFound($"Customer with ID {id} not found.");
            return NoContent();
        }

        // ── AI Endpoints ──

        [HttpPost("{id}/summary")]
        public async Task<IActionResult> GetAISummary(int id, [FromBody] AiSummaryRequest request)
        {
            var customer = await _customerService.GetByIdAsync(id);
            if (customer == null)
                return NotFound($"Customer with ID {id} not found.");

            try
            {
                var summary = await _aiService.GetCustomerSummaryAsync(
                    id,
                    request.IncludeServiceHistory,
                    request.IncludeBookings,
                    request.IncludeMaintenance,
                    request.SpecificQuestion
                );
                return Ok(new { summary });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "AI service unavailable: " + ex.Message });
            }
        }

        [HttpPost("{id}/ask")]
        public async Task<IActionResult> AskAI(int id, [FromBody] AskRequest request)
        {
            var customer = await _customerService.GetByIdAsync(id);
            if (customer == null)
                return NotFound($"Customer with ID {id} not found.");

            try
            {
                var answer = await _aiService.AskQuestionAsync(id, request.Question, request.MaxIterations);
                return Ok(new { answer });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "AI service error: " + ex.Message });
            }
        }
    }

    // Request DTOs for AI
    public class AiSummaryRequest
    {
        public bool IncludeServiceHistory { get; set; } = true;
        public bool IncludeBookings { get; set; } = true;
        public bool IncludeMaintenance { get; set; } = true;
        public string? SpecificQuestion { get; set; }
    }

    public class AskRequest
    {
        public string Question { get; set; } = string.Empty;
        public int MaxIterations { get; set; } = 5;
    }
}