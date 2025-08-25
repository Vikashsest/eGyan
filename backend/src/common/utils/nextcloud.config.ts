import axios from 'axios';
import path from 'path';

export const nextcloudConfig = {
  baseUrl: process.env.NEXTCLOUD_BASE_URL || 'https://cloud.ptgn.in/c', // sirf root server URL
  username: process.env.NEXTCLOUD_USER || 'egyan',
  password: process.env.NEXTCLOUD_PASS || 'B9++H9Zv8}pI',
  rootFolder: process.env.NEXTCLOUD_ROOT_FOLDER || 'books',
};

/**
 * Generates a public link for a file in Nextcloud.
 * @param remotePath Path relative to the rootFolder, e.g. '5/chapters/chapter-1.pdf'
 */
export async function generatePublicLink(remotePath: string): Promise<string> {
  try {
    // remotePath example: 'books/3/chapters/chapter-1.pdf'
    const response = await axios.post(
      `${nextcloudConfig.baseUrl}/ocs/v2.php/apps/files_sharing/api/v1/shares`,
      new URLSearchParams({
        path: remotePath, // just relative path
        shareType: '3', // public link
        permissions: '1', // read-only
      }),
      {
        auth: {
          username: nextcloudConfig.username,
          password: nextcloudConfig.password,
        },
        headers: {
          'OCS-APIRequest': 'true',
        },
      }
    );

    return response.data.ocs.data.url;
  } catch (err: any) {
    console.error('Error generating public link:', err.message, err.response?.data);
    throw new Error('Failed to generate public link');
  }
}

