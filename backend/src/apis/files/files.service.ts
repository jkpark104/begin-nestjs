import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';

interface IFilesServiceUpload {
  files: FileUpload[];
}

@Injectable()
export class FilesService {
  async upload({ files }: IFilesServiceUpload): Promise<string[]> {
    // 1. 파일을 클라우드 스토리지에 업로드하는 로직

    // 1-1) 스토리지 셋팅하기
    const bucket = 'bucket-name';
    const storage = new Storage({
      projectId: 'project-id',
      keyFilename: 'gcp-file-storage.json',
    }).bucket(bucket);

    // 1-2) 스토리지에 파일 업로드하기
    const results = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            file.createReadStream().pipe(
              storage
                .file(file.filename)
                .createWriteStream()
                .on('finish', () => {
                  console.log('성공');
                  resolve(`${bucket}/${file.filename}`);
                })
                .on('error', () => {
                  console.log('실패');
                  reject('실패');
                }),
            );
          }),
      ),
    );

    console.log('파일 전송이 완료되었습니다.');

    return results;
  }
}
