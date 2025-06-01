const fs = require("fs")
const csv = require("csv-parser")
const mongoose = require("mongoose")
const Property = require("../models/Property")
const User = require("../models/User")
require("dotenv").config()

// Connect to MongoDB
async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/property-listing"
    await mongoose.connect(mongoURI)
    console.log("✅ MongoDB connected for data import")
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  }
}

// Property type mapping
function mapPropertyType(type) {
  const typeMap = {
    apartment: "apartment",
    house: "house",
    condo: "condo",
    townhouse: "townhouse",
    villa: "villa",
    studio: "studio",
  }
  return typeMap[type?.toLowerCase()] || "other"
}

// Status mapping
function mapStatus(status) {
  const statusMap = {
    available: "available",
    sold: "sold",
    rented: "rented",
  }
  return statusMap[status?.toLowerCase()] || "available"
}

// Create sample data
async function createSampleData(userId) {
  const sampleProperties = [
    {
      title: "Modern Downtown Apartment",
      description:
        "Beautiful modern apartment in the heart of downtown with stunning city views and premium amenities.",
      price: 350000,
      location: "Downtown, New York, NY",
      propertyType: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      amenities: ["gym", "pool", "parking", "security", "balcony"],
      images: ["/placeholder.svg?height=300&width=400"],
      status: "available",
      createdBy: userId,
    },
    {
      title: "Spacious Family House",
      description: "Perfect family home with large backyard, modern kitchen, and quiet neighborhood setting.",
      price: 650000,
      location: "Suburbs, Los Angeles, CA",
      propertyType: "house",
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      amenities: ["garden", "garage", "fireplace", "deck", "storage"],
      images: ["/placeholder.svg?height=300&width=400"],
      status: "available",
      createdBy: userId,
    },
    {
      title: "Luxury Oceanfront Condo",
      description: "Stunning oceanfront condominium with panoramic views and resort-style amenities.",
      price: 950000,
      location: "Miami Beach, FL",
      propertyType: "condo",
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      amenities: ["ocean view", "pool", "spa", "concierge", "gym"],
      images: ["/placeholder.svg?height=300&width=400"],
      status: "available",
      createdBy: userId,
    },
    {
      title: "Cozy Studio Apartment",
      description: "Charming studio in trendy neighborhood, perfect for young professionals.",
      price: 180000,
      location: "Brooklyn, NY",
      propertyType: "studio",
      bedrooms: 0,
      bathrooms: 1,
      area: 600,
      amenities: ["laundry", "security", "rooftop"],
      images: ["/placeholder.svg?height=300&width=400"],
      status: "available",
      createdBy: userId,
    },
    {
      title: "Victorian Townhouse",
      description: "Historic townhouse with modern updates, original hardwood floors and character.",
      price: 480000,
      location: "San Francisco, CA",
      propertyType: "townhouse",
      bedrooms: 3,
      bathrooms: 2,
      area: 1600,
      amenities: ["fireplace", "parking", "garden", "historic"],
      images: ["/placeholder.svg?height=300&width=400"],
      status: "sold",
      createdBy: userId,
    },
  ]

  await Property.insertMany(sampleProperties)
  console.log(`✅ Created ${sampleProperties.length} sample properties`)
}

// Main import function
async function importData() {
  try {
    await connectDB()
    console.log("🔄 Starting data import...")

    // Create a default user for imported properties
    let defaultUser = await User.findOne({ email: "admin@example.com" })
    if (!defaultUser) {
      defaultUser = new User({
        email: "admin@example.com",
        password: "admin123",
        name: "Admin User",
      })
      await defaultUser.save()
      console.log("✅ Default user created (email: admin@example.com, password: admin123)")
    }

    // Clear existing properties
    await Property.deleteMany({})
    console.log("🗑️ Cleared existing properties")

    const csvFilePath = "./data/properties.csv"

    // Check if CSV file exists
    if (!fs.existsSync(csvFilePath)) {
      console.log("📥 CSV file not found. Creating sample data...")
      await createSampleData(defaultUser._id)
    } else {
      console.log("📊 Importing data from CSV...")
      const properties = []

      // Read and parse CSV
      await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on("data", (row) => {
            try {
              const property = {
                title: row.title || "Untitled Property",
                description: row.description || "No description available",
                price: Number.parseFloat(row.price) || 0,
                location: row.location || "Unknown Location",
                propertyType: mapPropertyType(row.property_type),
                bedrooms: Number.parseInt(row.bedrooms) || 0,
                bathrooms: Number.parseInt(row.bathrooms) || 0,
                area: Number.parseFloat(row.area) || 0,
                amenities: row.amenities ? row.amenities.split(",").map((a) => a.trim()) : [],
                images: row.images ? row.images.split(",").map((i) => i.trim()) : [],
                status: mapStatus(row.status),
                createdBy: defaultUser._id,
              }
              properties.push(property)
            } catch (error) {
              console.error("Error parsing row:", error)
            }
          })
          .on("end", resolve)
          .on("error", reject)
      })

      if (properties.length > 0) {
        await Property.insertMany(properties)
        console.log(`✅ Imported ${properties.length} properties from CSV`)
      } else {
        console.log("⚠️ No valid properties found in CSV, creating sample data...")
        await createSampleData(defaultUser._id)
      }
    }

    console.log("🎉 Data import completed successfully!")
    console.log("📊 You can now start the server with: npm start")
  } catch (error) {
    console.error("❌ Import failed:", error)
  } finally {
    mongoose.connection.close()
  }
}

// Run the import
if (require.main === module) {
  importData()
}

module.exports = { importData, createSampleData }
