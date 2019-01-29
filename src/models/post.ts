import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 100, nullable: false })
    public title: string;

    @Column({ length: 100, nullable: false })
    public body: string;
}
