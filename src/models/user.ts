import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 100, nullable: false })
    public name: string;

    @Column({ length: 50, nullable: false, unique: true })
    public email: string;

    @Column({ length: 100, nullable: false })
    public password: string;

}
