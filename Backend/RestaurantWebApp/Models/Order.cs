using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

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

        [NotMapped]
        public string DeletedOrderItems { get; set; }

        public virtual Customer? Customer { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }
    }
}
