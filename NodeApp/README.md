# CCT Service Request Dashboard API (Node Express)


# Live Example
### http://api-cct.zwivhu.dev/swagger


## Introduction

This Node.js Express application serves as an API for interacting with data stored on Amazon S3. It includes functionality for fetching distinct column values and filtering/searching data. The application utilizes S3 Select for efficient data retrieval from CSV files stored on Amazon S3.

## Getting Started

### 1. Clone the repository:

   ```bash
   git this repo - clone the repo
   cd repo/NodeApp
  ```

### 2. Install dependencies:

   ```bash
   npm install
   ```

### 3. Set environment variables:
```python
API_BASE_URL=http://localhost:3000
AWS_S3_ACCESS_KEY_ID=your_access_key_id
AWS_S3_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET_NAME=cct-ds-code-challenge-input-data
AWS_S3_REGION=af-south-1
```
Note: Replace your_access_key_id and your_secret_access_key with your AWS S3 credentials.

### 4. Start the server:
   ```bash
   npm start
   ```

The server will start on http://localhost:3000.

_____

## Swagger Documentation
Access the Swagger documentation at: http://localhost:3000/swagger or
http://api-cct.zwivhu.dev/swagger

Please note that endpoints for chart data are not included in the Swagger documentation.

**1. Get Distinct Column Values**

   - Endpoint: /unique-by-column/:columnName
  -  Method: GET
  - Description: Returns distinct values for the specified column.
   - Example: http://localhost:3000/unique-by-column/department will return distinct values for the department column

**2. Filter and Search Data**
-  Endpoint: /search
- Method: GET
-  Description: Filters data based on the specified columns and search term.
-  Example: http://localhost:3000/search


## Additional Configurations
- Cache Configuration
-  This application uses node-cache for caching data. The cache expiration time is set to 30 minutes.

## Possible Enhancements
### Security
- IP Whitelisting: Implement IP whitelisting to restrict access to certain IPs.

### Automatic File Download:
- Consider implementing a mechanism to download files from S3 automatically after a specific time interval.

### S3 Select:
- Investigate the use of S3 Select to optimize data retrieval from S3.

### Development:
Feel free to explore, modify, and extend the functionality according to your needs. If you have any questions or issues, please refer to the documentation or **me@zwivhu.dev**.
