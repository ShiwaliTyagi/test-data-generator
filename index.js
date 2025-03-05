import { faker } from "@faker-js/faker"; // Library to generate fake data
import fs from "fs"; // File system module for reading/writing files
import { createHash } from "crypto"; // Module to hash data
import { create } from "xmlbuilder2"; // Library to generate XML data
import { Command } from "commander"; // CLI argument parsing library

// Initialize the command-line argument parser
const program = new Command();
program
  .option("-c, --count <number>", "Number of records to generate", 10)
  .option("-f, --format <type>", "Output format: json, csv, or xml", "json")
  .option("--fields <path>", "Path to custom fields JSON", "custom-fields.json")
  .option("--mask <path>", "Path to masking config JSON", "masking-config.json")
  .parse(process.argv);

// Retrieve command-line arguments
const { count, format, fields, mask } = program.opts();
const numberOfRecords = parseInt(count);

// Function to load JSON files (custom fields & masking config)
function loadJsonFile(path) {
  try {
    if (fs.existsSync(path)) {
      return JSON.parse(fs.readFileSync(path, "utf8"));
    }
  } catch (error) {
    console.error(`⚠ Error loading ${path}:`, error.message);
  }
  return {};
}

// Load custom fields and masking configuration
const customFields = loadJsonFile(fields);
const maskingConfig = loadJsonFile(mask);

// Function to mask/anonymize data based on masking configuration
function maskData(field, value) {
  const method = maskingConfig[field];
  if (!method) return value; // If no masking is needed, return original value

  switch (method) {
    case "fake":
      return faker.person.fullName(); // Replace with fake data
    case "mask":
      return value.replace(/.(?=.{3}@)/g, "*"); // Mask email (e.g., ***@example.com)
    case "partial":
      return value.slice(0, 3) + "*".repeat(value.length - 3); // Partially mask data
    case "hash":
      return createHash("sha256").update(value).digest("hex"); // Hash data for anonymization
    default:
      return value;
  }
}

// Function to generate test data
function generateTestData() {
  let data = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    company: faker.company.name(),
    createdAt: faker.date.past().toISOString(),
  };

  // Apply masking to relevant fields
  for (const key in data) {
    data[key] = maskData(key, data[key]);
  }

  // Add custom fields specified by the user
  for (const [key, type] of Object.entries(customFields)) {
    data[key] = type === "number" ? faker.number.int({ min: 1000, max: 9999 }) : faker.word.sample();
  }

  return data;
}

// Generate test data records based on user input
const testData = Array.from({ length: numberOfRecords }, generateTestData);

// Write the generated test data to a file in the specified format
if (format === "json") {
  fs.writeFileSync("test-data.json", JSON.stringify(testData, null, 2));
  console.log(`✅ JSON data generated: test-data.json`);
} else if (format === "csv") {
  const csvData = [
    Object.keys(testData[0]).join(","),
    ...testData.map((item) => Object.values(item).join(",")),
  ].join("\n");

  fs.writeFileSync("test-data.csv", csvData);
  console.log(`✅ CSV data generated: test-data.csv`);
} else if (format === "xml") {
  const root = create({ version: "1.0" }).ele("TestData");

  testData.forEach((item) => {
    const record = root.ele("Record");
    Object.entries(item).forEach(([key, value]) => {
      record.ele(key).txt(value);
    });
  });

  fs.writeFileSync("test-data.xml", root.end({ prettyPrint: true }));
  console.log(`✅ XML data generated: test-data.xml`);
} else {
  console.error("❌ Unsupported format. Use json, csv, or xml.");
}
