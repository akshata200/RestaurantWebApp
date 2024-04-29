using System;
using System.Collections.Generic;

namespace RestaurantWebApp.Models
{
    public partial class Item
    {
        public Item()
        {
            OrderItems = new HashSet<OrderItem>();
        }

        public int ItemId { get; set; }
        public string? Name { get; set; }
        public decimal? Price { get; set; }

        public virtual ICollection<OrderItem> OrderItems { get; set; }
    }
}
