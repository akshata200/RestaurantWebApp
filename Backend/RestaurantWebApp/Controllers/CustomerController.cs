using Microsoft.AspNetCore.Mvc;

using RestaurantWebApp.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RestaurantWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {

        private readonly RestaurantDBContext _context;

        public CustomerController(RestaurantDBContext context)
        {
            _context = context;
        }

        // GET: api/<CustomerController>
        [HttpGet]
        public IActionResult GetCustomers()
        {
            try
            {
                List<Customer> customers = _context.Customers.ToList();
                if(customers != null && customers.Count > 0) {
                    return Ok(customers);
                }
                return Ok("No customers to display");

            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
