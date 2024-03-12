
import * as process from "process";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "./util/pipes/validation.pipe";
import * as cookieParser from 'cookie-parser'
import { IoAdapter } from '@nestjs/platform-socket.io';
import { FastifyAdapter } from "@nestjs/platform-fastify";
import fastifyCookie from "@fastify/cookie";



class MyIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, {
            ...options,
            cors: {
                origin: 'http://localhost:3000',
                credentials: true,
                methods: ["GET", "POST"],
                allowedHeaders: ["user-id", "my-custom-header"],
            },
        });
        return server;
    }
}
async function bootstrap() {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());

    app.useWebSocketAdapter(new MyIoAdapter(app));


    const config = new DocumentBuilder()
      .setTitle('Приложение языковых флеш-карточек')
      .setDescription('Документация REST API')
      .setVersion('1.0.0')
      .addTag('Gipp')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    app.use(cookieParser());
    await app.getHttpAdapter().getInstance().register(fastifyCookie)



    app.useGlobalPipes(new ValidationPipe());

    const PORT = process.env.PORT || 5000;
    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}


bootstrap();
