import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ApiGenerator {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column({ default: 'https://registry.npmjs.org/' })
	registry: string

	@Column({ nullable: true })
	npmrc: string

	@OneToMany(() => ApiInfo, apiInfo => apiInfo.apiName, { cascade: true })
	apiList: ApiInfo[]
}

@Entity()
export class ApiInfo {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => ApiGenerator, o => o.name)
	apiName: string

	@Column()
	name: string

	@Column()
	url: string
}
