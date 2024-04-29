using System;
using System.Collections.Generic;

namespace RestaurantWebApp.Models
{
    public partial class Order
    {
        public Order()
        {
            OrderItems = new HashSet<OrderItem>();
        }

        public long OrderId { get; set; }
        public string? OrderNo { get; set; }
        public int? CustomerId { get; set; }
        public string? PaymentMethod { get; set; }
        public decimal? GrandTotal { get; set; }

        public virtual Customer? Customer { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }
    }
}
