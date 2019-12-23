import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity("tasks")
export class Task extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 100, nullable: false })
  public title: string;

  @Column({ nullable: false })
  public done: boolean = false;

  @ManyToOne((type) => User, (user) => user.tasks)
  public user: User;
}
