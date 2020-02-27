import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import bcrypt from "bcryptjs";

@Entity()
export class User {

    @BeforeInsert()
    @BeforeUpdate()
    async encodingPassword() {
        this.password = await bcrypt.hash(this.password, 8);
    }

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public name!: string;

    @Column()
    public email!: string;

    @Column()
    public password!: string;

    @CreateDateColumn()
    public readonly created_at!: Date;

    @UpdateDateColumn()
    public readonly updated_at!: Date;

}