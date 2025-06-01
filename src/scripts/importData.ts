import fs from "fs"
import csv from "csv-parser"
import { connectDB } from "../config/database"
import { Property } from "../models/Property"
import { User } from "../models/User"
import mongoose from "mongoose"

interface CSVRow {
  title: string
  description: string
  price: string
  location: string
  property_type: string
  bedrooms: string
  bathrooms: string
  area: string
  amenities: string
  images: string
  status: string
}

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
      console.log("✅ Default user created")
    }

    // Clear existing properties
    await Property.deleteMany({})
    console.log("🗑️ Cleared existing properties")

    const properties: any[] = []
    const csvFilePath = "./data/properties.csv"

    // Check if CSV file exists
    if (!fs.existsSync(csvFilePath)) {
      console.log("📥 CSV file not found. Creating sample data...")
      await createSampleData(defaultUser._id)
      return
    }

    // Read and parse CSV
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row: CSVRow) => {
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
      .on("end", async () => {
        try {
          if (properties.length > 0) {
            await Property.insertMany(properties)
            console.log(`✅ Imported ${properties.length} properties successfully`)
          } else {
            console.log("⚠️ No valid properties found in CSV")
            await createSampleData(defaultUser._id)
          }
        } catch (error) {
          console.error("❌ Error inserting properties:", error)
        } finally {
          mongoose.connection.close()
        }
      })
  } catch (error) {
    console.error("❌ Import failed:", error)
    mongoose.connection.close()
  }
}

function mapPropertyType(type: string): string {
  const typeMap: { [key: string]: string } = {
    apartment: "apartment",
    house: "house",
    condo: "condo",
    townhouse: "townhouse",
    villa: "villa",
    studio: "studio",
  }

  return typeMap[type?.toLowerCase()] || "other"
}

function mapStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    available: "available",
    sold: "sold",
    rented: "rented",
  }

  return statusMap[status?.toLowerCase()] || "available"
}

async function createSampleData(userId: mongoose.Types.ObjectId) {
  const sampleProperties = [
    {
      title: "Modern Downtown Apartment",
      description: "Beautiful modern apartment in the heart of downtown with stunning city views.",
      price: 250000,
      location: "Downtown, New York",
      propertyType: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      amenities: ["gym", "pool", "parking", "security"],
      images: ["/placeholder.svg?height=300&width=400"],
      status: "available",
      createdBy: userId,
    },
    {
      title: "Spacious Family House",
      description: "Perfect family home with large backyard and modern amenities.",
      price: 450000,
      location: "Suburbs, California",
      propertyType: "house",
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      amenities: ["garden", "garage", "fireplace"],
      images: ["/placeholder.svg?height=300&width=400"],
      status: "available",
      createdBy: userId,
    },
    {
      title: "Luxury Condo with Ocean View",
      description: "Stunning oceanfront condo with premium finishes and amenities.",
      price: 750000,
      location: "Miami Beach, Florida",
      propertyType: "condo",
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      amenities: ["ocean view", "pool", "spa", "concierge"],
      images: ["/placeholder.svg?height=300&width=400"],
      status: "available",
      createdBy: userId,
    },
  ]

  await Property.insertMany(sampleProperties)
  console.log("✅ Created sample properties")
}

// Run the import
importData()
