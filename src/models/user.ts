import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 100, nullable: false })
    public name: string;

    @Column({ length: 50, nullable: false, unique: true })
    public email: string;

    @Column({ length: 100, nullable: false, select: false })
    public password: string;

    @OneToMany((type) => Task, (task) => task.user)
    public tasks: Task[];
}
