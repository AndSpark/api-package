import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export abstract class AbstractEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@CreateDateColumn()
	create_time: string

	@UpdateDateColumn()
	update_time: string
}
