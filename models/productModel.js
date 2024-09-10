const mongoose = require("mongoose");

const computerPropertySchema = mongoose.Schema({
  series: {
    type: String,
 
  },
  model: {
    type: String,
  
  },
  weight: {
    type: String,

  },
  dimension: {
    type: String,
 
  },
  item: {
    type: String,

  },
  color: {
    type: String,
 
  },
  hardware: {
    type: String,

  },
  os: {
    type: String,
   
  },
  processor: {
    type: String,
  
  },
  number: {
    type: Number,
  
  },
  memory: {
    type: String,
  
  },
  ram: {
    type: String,
    required: true
  },
  drive: {
    type: String,
    required: true
  },
  display: {
    type: String
   
  },
  resolution: {
    type: String
  
  },
  graphics: {
    type: String,
  
  },
  voltage: {
    type: String
   
  },
  battery: {
    type: String,
   
  },
  wireless: {
    type: String,

  }
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    price: {
  type: Number,
  required: true,
  min: [1, 'Price must be at least 1'] 
},
    odd: {
      type: String
    },
    brand: {
      type: String,
      required: true
    },
    quantity: {
      type: String
    },
    id: {
      type: Number
    },
    category: {
      type: String,
      required: true
    },

    computerProperty: [computerPropertySchema],
    

    images: [
      {
        public_id: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        }
      }
    ],

    createAt: {
      type: Date,
      default: Date.now()
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
