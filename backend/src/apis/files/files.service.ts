import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';

interface IFilesServiceUpload {
  file: FileUpload;
}

@Injectable()
export class FilesService {
  async upload({ file }: IFilesServiceUpload): Promise<string> {
    // 1. 파일을 클라우드 스토리지에 업로드하는 로직

    // 1-1) 스토리지 셋팅하기
    const storage = new Storage({
      projectId: 'project-id',
      keyFilename: 'gcp-file-storage.json',
    }).bucket('bucket-name');

    // 1-2) 스토리지에 파일 업로드하기
    await new Promise((resolve, reject) => {
      file.createReadStream().pipe(
        storage
          .file(file.filename)
          .createWriteStream()
          .on('finish', () => {
            console.log('성공');
            resolve('성공');
          })
          .on('error', () => {
            console.log('실패');
            reject('실패');
          }),
      );
    });

    console.log('파일 전송이 완료되었습니다.');

    return '끝';
  }
}
