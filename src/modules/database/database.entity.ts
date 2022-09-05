import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export abstract class AbstractEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@CreateDateColumn()
	createTime: string

	@UpdateDateColumn()
	updateTime: string
}
