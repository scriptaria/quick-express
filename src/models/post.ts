import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 100, nullable: false })
    public title: string;

    @Column("text", { nullable: false })
    public body: string;

    @ManyToOne((type) => User, (user) => user.posts)
    public user: User;
}
