import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {
	constructor(private prisma: PrismaService) {}

	async create(createProductDto: CreateProductDto) {
		const product = await this.prisma.product.create({
			data: createProductDto
		});
		return product;
	}

	async findAll(paginationDto: PaginationDto) {
		const { page = 1, limit = 10 } = paginationDto;

		const totalPages = await this.prisma.product.count();
		const lastPage = Math.ceil(totalPages / limit);

		return {
			data: await this.prisma.product.findMany({
				skip: (page - 1) * limit,
				take: limit,
				where: { available: true }
			}),
			meta: {
				page,
				total: totalPages,
				lastPage
			}
		};
	}

	async findOne(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id, available: true }
		});

		if (!product) {
			throw new NotFoundException(`Product with ID ${id} not found`);
		}

		return product;
	}

	async update(id: number, updateProductDto: UpdateProductDto) {
		await this.findOne(id); // Check if the product exists before updating

		const product = await this.prisma.product.update({
			where: { id, available: true },
			data: updateProductDto
		});
		return product;
	}

	async remove(id: number) {
		await this.findOne(id); // Check if the product exists before removing

		const product = await this.prisma.product.update({
			where: { id },
			data: { available: false }
		});
		return product;
	}
}
