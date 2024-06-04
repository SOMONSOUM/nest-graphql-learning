import { Injectable, UploadedFiles } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
// import * as AWS from 'aws-sdk';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';

@Injectable()
export class UploadService {
  constructor(private readonly authService: AuthService) {}

  async uploadFiles(
    userId: number,
    dir: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<string[]> {
    // configue AWS
    // AWS.config.update({
    //   credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY,
    //     secretAccessKey: process.env.AWS_SECRET_KEY,
    //   },
    // });

    // upload to S3 Bucket
    try {
      const fileUrls = [];

      //get single file and upload to S3
      for (const file of files) {
        const encryptedUserId = await this.authService.encrypt({
          target: String(userId),
        });
        const objectName = `${dir}/${encryptedUserId}/${Date.now()}.jpeg`;

        // await new AWS.S3()
        //   .putObject({
        //     Body: file.buffer,
        //     Bucket: process.env.S3_BUCKET_NAME,
        //     Key: objectName,
        //     ACL: 'public-read',
        //   })
        //   .promise();

        const url = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${objectName}`;

        fileUrls.push(url);
      }

      return fileUrls;
    } catch (e) {
      throw e;
    }
  }

  // delete files from S3
  async deleteFiles(urls: string[]): Promise<BaseResponseDTO> {
    if (urls.length === 0) {
      return { result: true };
    }

    const URL_PREFIX = 'https://wooriga-prod.s3.amazonaws.com/';
    const BUCKET_NAME = process.env.S3_BUCKET_NAME;

    // configure AWS
    // AWS.config.update({
    //   credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY,
    //     secretAccessKey: process.env.AWS_SECRET_KEY,
    //   },
    // });

    try {
      const param = {
        Bucket: BUCKET_NAME,
        Delete: {
          Objects: [],
        },
      };

      // format urls to delete
      urls.forEach((fileUrl) => {
        const key = fileUrl.replace(URL_PREFIX, '');

        param.Delete.Objects.push({ Key: key });
      });

      // await new AWS.S3().deleteObjects(param).promise();
    } catch (e) {
      throw e;
    }

    return { result: true };
  }
}
