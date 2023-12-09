import pandas as pd
import geopandas as gpd
import time
import logging
import boto3
from botocore.exceptions import NoCredentialsError
import h3

# AWS credentials as provided ds team
AWS_ACCESS_KEY_ID = 'AKIAYH57YDEWMHW2ESH2'
AWS_SECRET_ACCESS_KEY = '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'
AWS_S3_BUCKET_NAME = "cct-ds-code-challenge-input-data"

# Files
FILE_SERVICE_REQUEST = "sr.csv.gz"
FILE_GEO_CODE_HEXAGON_POLYGONS_ZOOM_LEVEL_8 = "city-hex-polygons-8.geojson"
FILE_OUTPUT_NAME = "sr_hex_zwi.csv.gz"

# Threshold for join error percentage
# Set to 0.0 for no threshold because the join is guaranteed to succeed
# Especially with logic dealing with missing latitude and longitude
ERROR_THRESHOLD = 0.0


# Function to download file from S3
def download_file_from_s3(bucket, key, local_path):
    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
    try:
        s3.download_file(bucket, key, local_path)
    except NoCredentialsError:
        logging.error("Credentials not available")


# Function to get H3 index from latitude and longitude
def get_h3_index(row):
    try:
        h3_index = h3.geo_to_h3(row['latitude'], row['longitude'], 8)
        return h3_index
    except (ValueError, TypeError):
        # As per  request, if latitude and longitude are missing, return '0'
        return '0'


def join_hexagons_to_service_requests(sr_file, hex_file, output_file):
    # Start timing the operation
    start_time = time.time()

    # Download files from S3
    download_file_from_s3(AWS_S3_BUCKET_NAME, sr_file, FILE_SERVICE_REQUEST)
    download_file_from_s3(AWS_S3_BUCKET_NAME, hex_file, FILE_GEO_CODE_HEXAGON_POLYGONS_ZOOM_LEVEL_8)

    # Load service request data
    sr_data = pd.read_csv(FILE_SERVICE_REQUEST, compression='gzip')

    # Drop the first column from sr_data
    sr_data = sr_data.iloc[:, 1:]

    # Load hexagon polygons data as GeoDataFrame
    hex_data = gpd.read_file(FILE_GEO_CODE_HEXAGON_POLYGONS_ZOOM_LEVEL_8)

    # Convert 'sr_data' to a GeoDataFrame using latitude and longitude
    sr_data_geo = gpd.GeoDataFrame(
        sr_data,
        geometry=gpd.points_from_xy(sr_data.longitude, sr_data.latitude),
        crs='EPSG:4326'
    )

    # Add H3 index column to 'sr_data_geo'
    sr_data_geo['h3_level8_index'] = sr_data_geo.apply(get_h3_index, axis=1)

    # Spatial join based on H3 index
    merged_data = gpd.sjoin(sr_data_geo, hex_data, how='left', predicate='within')

    # Columns to keep
    columns_to_keep = ['notification_number', 'reference_number', 'creation_timestamp', 'completion_timestamp',
                       'directorate', 'department', 'branch', 'section', 'code_group', 'code', 'cause_code_group',
                       'cause_code', 'official_suburb', 'latitude', 'longitude', 'h3_level8_index']

    merged_data = merged_data[columns_to_keep]

    # Fill error values in 'h3_level8_index' with '0'
    merged_data['h3_level8_index'] = merged_data['h3_level8_index'].fillna('0')

    # Calculate time taken for the operation
    logging.info(f'Time taken: {time.time() - start_time} seconds')

    # Calculate the percentage of records that failed to join
    merge_error_percentage = (len(sr_data_geo) - len(merged_data)) / len(sr_data_geo)

    # Log the percentage of records that failed to join
    logging.info(f'Merge error percentage: {merge_error_percentage * 100}%')

    # Exit if the merge error percentage exceeds the threshold
    if merge_error_percentage > ERROR_THRESHOLD:
        raise ValueError(f'Merge error percentage exceeds allowed threshold of {ERROR_THRESHOLD * 100}%')

    # Save the merged data to a CSV file
    merged_data.to_csv(output_file, index=False, compression='gzip')


if __name__ == "__main__":
    # Input file paths in S3
    sr_file_path = FILE_SERVICE_REQUEST
    hex_file_path = FILE_GEO_CODE_HEXAGON_POLYGONS_ZOOM_LEVEL_8

    # Output file path in S3
    output_file_path = FILE_OUTPUT_NAME

    # Configure logging
    logging.basicConfig(level=logging.INFO)

    # Run the data transformation
    join_hexagons_to_service_requests(sr_file_path, hex_file_path, output_file_path)
