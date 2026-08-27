import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
	const logger = new Logger('Main');
	const app = await NestFactory.createMicroservice(AppModule, {
		transport: Transport.NATS,
		options: {
			servers: envs.natsServers
		}
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true
		})
	);

	await app.listen();
	logger.log(`Products Microservice is listening on port ${envs.port}`);
}
bootstrap();
