import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public name!: string;

    @Column()
    public email!: string;

    public password!: string;

    @Column({ name: 'password', nullable: true })
    public password_hash!: string;


    @CreateDateColumn()
    public readonly created_at!: Date;

    @UpdateDateColumn()
    public readonly updated_at!: Date;

}