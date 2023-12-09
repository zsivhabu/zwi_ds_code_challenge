## Service Requests Hexagon Join

This Python script is designed to join service request data with hexagonal polygons based on geographical coordinates (latitude and longitude). The script utilizes AWS S3 for data storage and retrieval.

### Prerequisites

Before running the script, ensure you have the following installed:

- [Pandas](https://pandas.pydata.org/): A powerful data manipulation library.
- [GeoPandas](https://geopandas.org/): Extends Pandas to enable spatial operations.
- [H3](https://github.com/uber/h3): Python bindings for H3, a spatial indexing system.
- [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html): The Amazon Web Services (AWS) SDK for Python.

Make sure to install these dependencies using:

```bash
pip install pandas geopandas boto3 botocore h3
```

### Configuration
Replace the placeholder AWS credentials in the script with your own credentials:

```python
AWS_ACCESS_KEY_ID = 'YOUR_ACCESS_KEY'
AWS_SECRET_ACCESS_KEY = 'YOUR_SECRET_KEY'
```

### Usage
Adjust the S3 file paths in the script:

```python
FILE_SERVICE_REQUEST = "sr.csv.gz"
FILE_GEO_CODE_HEXAGON_POLYGONS_ZOOM_LEVEL_8 = "city-hex-polygons-8.geojson"
FILE_OUTPUT_NAME = "sr_hex_zwi.csv.gz"
```

### Error Threshold
Set the error threshold. This represents the acceptable percentage of records that can fail to join without raising an error. Modify if necessary:

```python
ERROR_THRESHOLD = 0.0
```

### Running the Script
Execute the script using:
```bash
python 2_data_transformation.py
```
