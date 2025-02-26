"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
async function setupSwagger(app, docPath, docsConfig) {
    const options = new swagger_1.DocumentBuilder()
        .addBearerAuth()
        .setTitle(`${docsConfig.name}`)
        .setDescription(`${docsConfig.describe}`)
        .setVersion(`${docsConfig.version}`)
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup(docPath, app, document);
}
//# sourceMappingURL=setup-swagger.js.map