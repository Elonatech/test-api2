const mongoose = require("mongoose");


function generateSlug(name) {
  return name
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')        
    .replace(/[^\w\-]+/g, '')   
    .replace(/\-\-+/g, '-')    
    .replace(/^-+/, '')          
    .replace(/-+$/, '');         
}

async function generateUniqueSlug(name, existingId = null) {
  let slug = generateSlug(name);
  let counter = 1;
  let uniqueSlug = slug;
  
  while (true) {
    const existingProduct = await mongoose.model('Product', productSchema).findOne({ 
      slug: uniqueSlug,
      _id: { $ne: existingId ? mongoose.Types.ObjectId(existingId) : null }
    });
    
    if (!existingProduct) {
      return uniqueSlug;
    }
    
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
}

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
    type: String,
  
  },
  memory: {
    type: String,
  
  },
  ram: {
    type: String,
    
  },
  drive: {
    type: String,
   
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
    slug: {
      type: String,
      unique: true
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

productSchema.pre('save', async function(next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = await generateUniqueSlug(this.name, this._id);
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
