# Test Data Generator

## Overview

This script generates test data in JSON, CSV, or XML formats using the Faker.js library. It supports custom fields and data masking/anonymization for GDPR compliance.

## Features

- Generates fake test data with predefined fields.
- Supports JSON, CSV, and XML output formats.
- Allows customization of fields via a JSON file.
- Implements data masking and anonymization methods.
- Command-line interface (CLI) for easy configuration.

## Requirements

- Node.js installed (v14 or later)
- Faker.js (`@faker-js/faker`)
- Commander.js for CLI support
- XMLBuilder2 for XML output

## Installation

1. Clone this repository:
   ```sh
   git clone <repo-url>
   cd test-data-generator
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

Run the script with command-line options:

```sh
node index.js -c <count> -f <format> --fields <path> --mask <path>
```

### Example Commands:

1. Generate 20 JSON records:
   ```sh
   node index.js -c 20 -f json
   ```
2. Generate 15 CSV records:
   ```sh
   node index.js -c 15 -f csv
   ```
3. Generate 10 XML records with custom fields:
   ```sh
   node index.js -c 10 -f xml --fields custom-fields.json
   ```
4. Apply masking configuration:
   ```sh
   node index.js --mask masking-config.json
   ```

## Customization

### Custom Fields

Define custom fields in a JSON file (`custom-fields.json`):

```json
{
  "employeeID": "number",
  "department": "string"
}
```

### Data Masking Configuration

Configure masking rules in `masking-config.json`:

```json
{
  "email": "mask",
  "phone": "hash"
}
```

## Output Files

- `test-data.json` (JSON format)
- `test-data.csv` (CSV format)
- `test-data.xml` (XML format)

## License
