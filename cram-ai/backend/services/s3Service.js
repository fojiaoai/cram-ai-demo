const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();

/**
 * Upload file to S3
 * @param {string} filePath - Local file path
 * @param {string} fileName - File name for S3
 * @param {string} mimeType - File MIME type
 * @returns {Promise} S3 upload result
 */
async function uploadToS3(filePath, fileName, mimeType) {
  try {
    if (!process.env.AWS_S3_BUCKET) {
      throw new Error('AWS S3 bucket not configured');
    }

    const fileContent = fs.readFileSync(filePath);
    const key = `uploads/${Date.now()}-${fileName}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: fileContent,
      ContentType: mimeType,
      ACL: 'private', // Files are private by default
      Metadata: {
        'uploaded-by': 'cram-ai',
        'upload-date': new Date().toISOString()
      }
    };

    const result = await s3.upload(params).promise();
    
    console.log(`✅ File uploaded to S3: ${result.Location}`);
    
    return {
      Location: result.Location,
      Key: result.Key,
      Bucket: result.Bucket,
      ETag: result.ETag
    };

  } catch (error) {
    console.error('❌ S3 upload error:', error);
    throw error;
  }
}

/**
 * Generate presigned URL for file access
 * @param {string} key - S3 object key
 * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} Presigned URL
 */
async function getPresignedUrl(key, expiresIn = 3600) {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Expires: expiresIn
    };

    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;

  } catch (error) {
    console.error('❌ Presigned URL generation error:', error);
    throw error;
  }
}

/**
 * Delete file from S3
 * @param {string} key - S3 object key
 * @returns {Promise} Deletion result
 */
async function deleteFromS3(key) {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };

    const result = await s3.deleteObject(params).promise();
    console.log(`✅ File deleted from S3: ${key}`);
    
    return result;

  } catch (error) {
    console.error('❌ S3 deletion error:', error);
    throw error;
  }
}

/**
 * Check if S3 is configured and accessible
 * @returns {Promise<boolean>} Configuration status
 */
async function checkS3Configuration() {
  try {
    if (!process.env.AWS_S3_BUCKET || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return false;
    }

    // Test S3 access by listing bucket
    await s3.headBucket({ Bucket: process.env.AWS_S3_BUCKET }).promise();
    return true;

  } catch (error) {
    console.warn('⚠️ S3 configuration check failed:', error.message);
    return false;
  }
}

/**
 * Upload multiple files to S3
 * @param {Array} files - Array of file objects with path, name, and mimeType
 * @returns {Promise<Array>} Array of upload results
 */
async function uploadMultipleToS3(files) {
  const uploadPromises = files.map(file => 
    uploadToS3(file.path, file.name, file.mimeType)
  );

  try {
    const results = await Promise.allSettled(uploadPromises);
    
    return results.map((result, index) => ({
      file: files[index].name,
      success: result.status === 'fulfilled',
      result: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason.message : null
    }));

  } catch (error) {
    console.error('❌ Multiple S3 upload error:', error);
    throw error;
  }
}

/**
 * Get file metadata from S3
 * @param {string} key - S3 object key
 * @returns {Promise} File metadata
 */
async function getFileMetadata(key) {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };

    const result = await s3.headObject(params).promise();
    
    return {
      size: result.ContentLength,
      lastModified: result.LastModified,
      contentType: result.ContentType,
      etag: result.ETag,
      metadata: result.Metadata
    };

  } catch (error) {
    console.error('❌ S3 metadata retrieval error:', error);
    throw error;
  }
}

/**
 * Copy file within S3
 * @param {string} sourceKey - Source object key
 * @param {string} destinationKey - Destination object key
 * @returns {Promise} Copy result
 */
async function copyFileInS3(sourceKey, destinationKey) {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      CopySource: `${process.env.AWS_S3_BUCKET}/${sourceKey}`,
      Key: destinationKey
    };

    const result = await s3.copyObject(params).promise();
    console.log(`✅ File copied in S3: ${sourceKey} -> ${destinationKey}`);
    
    return result;

  } catch (error) {
    console.error('❌ S3 copy error:', error);
    throw error;
  }
}

/**
 * List files in S3 bucket with prefix
 * @param {string} prefix - Object key prefix
 * @param {number} maxKeys - Maximum number of keys to return
 * @returns {Promise<Array>} List of objects
 */
async function listFiles(prefix = 'uploads/', maxKeys = 1000) {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix: prefix,
      MaxKeys: maxKeys
    };

    const result = await s3.listObjectsV2(params).promise();
    
    return result.Contents.map(obj => ({
      key: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified,
      etag: obj.ETag
    }));

  } catch (error) {
    console.error('❌ S3 list files error:', error);
    throw error;
  }
}

/**
 * Generate upload presigned URL for direct client uploads
 * @param {string} fileName - File name
 * @param {string} mimeType - File MIME type
 * @param {number} expiresIn - URL expiration time in seconds
 * @returns {Promise} Presigned POST data
 */
async function getUploadPresignedUrl(fileName, mimeType, expiresIn = 3600) {
  try {
    const key = `uploads/${Date.now()}-${fileName}`;
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: mimeType,
      Expires: expiresIn,
      ACL: 'private'
    };

    const url = await s3.getSignedUrlPromise('putObject', params);
    
    return {
      uploadUrl: url,
      key: key,
      fields: {
        'Content-Type': mimeType,
        'ACL': 'private'
      }
    };

  } catch (error) {
    console.error('❌ Upload presigned URL generation error:', error);
    throw error;
  }
}

module.exports = {
  uploadToS3,
  getPresignedUrl,
  deleteFromS3,
  checkS3Configuration,
  uploadMultipleToS3,
  getFileMetadata,
  copyFileInS3,
  listFiles,
  getUploadPresignedUrl
};