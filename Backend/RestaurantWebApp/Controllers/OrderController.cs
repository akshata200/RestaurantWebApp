using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantWebApp.Models;

namespace RestaurantWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly RestaurantDBContext _context;

        public OrderController(RestaurantDBContext context)
        {
            _context = context;
        }

        // GET: api/Order
        [HttpGet]
        public System.Object GetOrders()
        {
            var result = (from o in _context.Orders
                          join c in _context.Customers
                          on o.CustomerId equals c.CustomerId
                          select new
                          {
                              o.OrderId,
                              o.OrderNo,
                              customer = c.Name,
                              o.PaymentMethod,
                              o.GrandTotal,
                              DeletedOrderItems=""
                          }).ToList();
            return result;
        }

        // GET: api/Order/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(long id)
        {

            var order = (from a in _context.Orders
                         where a.OrderId == id
                         select new
                         {
                             OrderId = a.OrderId,
                             OrderNo = a.OrderNo,
                             CustomerId =a.CustomerId,
                             PaymentMethod = a.PaymentMethod,
                             GrandTotal = a.GrandTotal,
                             DeletedOrderItems = ""
                         }).FirstOrDefault();

            var OrderItems = (from a in _context.OrderItems
                              join b in _context.Items on a.ItemId equals b.ItemId
                              where a.OrderId == id
                              select new
                              {
                                  a.OrderItemId,
                                  a.OrderId,
                                  b.ItemId,
                                  a.Quantity,
                                  ItemName = b.Name,
                                  b.Price,
                                  Total = a.Quantity * b.Price
                              }).ToList();

            return Ok(new { order, OrderItems});
        }

        // PUT: api/Order/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(long id, Order order)
        {
            if (id != order.OrderId)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Order
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            try
            {
                if (_context.Orders == null)
                {
                    return BadRequest("Entity set 'RestaurantDBContext.Orders'  is null.");
                }
                Console.WriteLine(order);
                //save data in orders table
                if(order == null || order.OrderId==0)
                {
                    // add new record
                    _context.Orders.Add(order);
                }
                else
                {
                    // update existing record
                    _context.Entry(order).State= EntityState.Modified;
                }
                
                // save data in OrderItems table
                foreach(var item in order.OrderItems)
                {
                    if (item.OrderItemId == 0)
                    {
                        // insert new orderItem
                        _context.OrderItems.Add(item);
                    }
                    else
                    {
                        // update existing orderItem
                        _context.Entry(item).State= EntityState.Modified;
                    }
                }

                //for deleted records
                foreach(string id in order.DeletedOrderItems.Split(',').Where(id => id != ""))
                {
                    OrderItem item = _context.OrderItems.Find(Convert.ToInt64(id));
                    _context.OrderItems.Remove(item);
                }
                

                await _context.SaveChangesAsync();

                //return CreatedAtAction("GetOrder", new { id = order.OrderId }, order);
                return Ok();
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/Order/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(long id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                var orderItem = _context.OrderItems.Where(item => item.OrderId == id).ToList();
                foreach(var items in orderItem)
                {
                    _context.OrderItems.Remove(items);
                }

                _context.Orders.Remove(order);

                await _context.SaveChangesAsync();
                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex);
            }
        }

        private bool OrderExists(long id)
        {
            return (_context.Orders?.Any(e => e.OrderId == id)).GetValueOrDefault();
        }
    }
}
