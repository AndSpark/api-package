import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { AbstractEntity } from '../../database/database.entity'

@Entity()
export class PackageEntity extends AbstractEntity {
	@Column()
	name: string

	@Column({ default: '0' })
	version: string

	@Column({ default: 'https://registry.npmjs.org/' })
	registry: string

	@Column({ nullable: true })
	npmrc: string

	@OneToMany(() => ApiInfoEntity, o => o.packageName, { cascade: true })
	apiList: ApiInfoEntity[]
}

@Entity()
export class ApiInfoEntity extends AbstractEntity {
	@ManyToOne(() => PackageEntity, o => o.name)
	packageName: string

	@Column()
	name: string

	@Column()
	url: string
}
