import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FilesService } from './files.service';

@Resolver()
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Mutation(() => String)
  uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload, // GraphQL에서 파일 받아옴
  ): // 브라우저에서 파일 받아옴
  Promise<string> {
    return this.filesService.upload({ file });
  }
}
