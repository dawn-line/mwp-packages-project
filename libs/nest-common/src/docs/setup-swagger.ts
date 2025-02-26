import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
export async function setupSwagger(app, docPath, docsConfig) {
  // 加载文档
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(`${docsConfig.name}`)
    .setDescription(`${docsConfig.describe}`)
    .setVersion(`${docsConfig.version}`)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(docPath, app, document);
}
