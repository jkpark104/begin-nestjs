import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'qqq', url: 'http://auth-service:3001/graphql' },
            { name: 'zzz', url: 'http://resource-service:3002/graphql' },
            // docker로 설정했기 때문에 localhost가 아닌 서비스 이름으로 설정
          ],
        }),
      },
    }),
  ],
})
export class AppModule {}
