import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { AbstractEntity } from '../../database/database.entity'

@Entity()
export class PackageEntity extends AbstractEntity {
	@Column()
	name: string

	@Column()
	version: string

	@Column({ default: 'https://registry.npmjs.org/' })
	registry: string

	@Column({ nullable: true })
	npmrc: string

	@Column({ nullable: true })
	packageUpdateTime: string

	@OneToMany(() => ApiInfoEntity, o => o.packageName, { cascade: ['insert', 'update', 'remove'] })
	apiList: ApiInfoEntity[]
}

@Entity()
export class ApiInfoEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => PackageEntity, o => o.name)
	packageName: string

	@Column()
	name: string

	@Column()
	url: string
}
