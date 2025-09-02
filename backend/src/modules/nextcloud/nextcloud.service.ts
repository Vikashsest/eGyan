import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createReadStream } from 'fs';
import * as path from 'path';
import { nextcloudConfig } from '../../common/utils/nextcloud.config';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class NextcloudService {
  private async ensureFolderExists(folderPath: string): Promise<void> {
    const baseUrl = nextcloudConfig.baseUrl.replace(/\/$/, '');
    const parts = folderPath.split('/');

    let currentPath = '';
    for (const part of parts) {
      currentPath += `/${part}`;
      const url = `${baseUrl}/remote.php/dav/files/${nextcloudConfig.username}${currentPath}`;
      await axios.request({
        method: 'PROPFIND',
        url,
        auth: {
          username: nextcloudConfig.username,
          password: nextcloudConfig.password,
        },
        headers: { Depth: '0' },
        validateStatus: (status) => status === 207 || status === 404,
      });
      await axios.request({
        method: 'MKCOL',
        url,
        auth: {
          username: nextcloudConfig.username,
          password: nextcloudConfig.password,
        },
        validateStatus: (status) => status === 201 || status === 405,
      });
    }
  }


async uploadFile(localPath: string, remotePath: string): Promise<string> {
  const folderPath = path.posix.dirname(remotePath);
  await this.ensureFolderExists(folderPath);

  const url = `${nextcloudConfig.baseUrl}/remote.php/dav/files/${nextcloudConfig.username}/${remotePath}`;
  const stream = createReadStream(localPath);

  const response = await axios.put(url, stream, {
    auth: {
      username: nextcloudConfig.username,
      password: nextcloudConfig.password,
    },
    headers: { 'Content-Type': 'application/octet-stream' },
    maxBodyLength: Infinity,
  });

  if (response.status >= 200 && response.status < 300) {
    // ✅ yahan sirf remotePath return karo, full URL nahi
    return remotePath;
  } else {
    throw new Error('Failed to upload to Nextcloud');
  }
}


 async uploadBuffer(buffer: Buffer, remotePath: string): Promise<string> {
    const folderPath = path.posix.dirname(remotePath);
    await this.ensureFolderExists(folderPath);

    const url = `${nextcloudConfig.baseUrl}/remote.php/dav/files/${nextcloudConfig.username}/${remotePath}`;
    const stream = Readable.from(buffer); // convert buffer to stream

    const response = await axios.put(url, stream, {
      auth: {
        username: nextcloudConfig.username,
        password: nextcloudConfig.password,
      },
      headers: { 'Content-Type': 'application/octet-stream' },
      maxBodyLength: Infinity,
    });

    if (response.status >= 200 && response.status < 300) {
      return remotePath;
    } else {
      throw new Error('Failed to upload buffer to Nextcloud');
    }
  }
}
