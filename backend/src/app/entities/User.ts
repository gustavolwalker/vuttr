import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import bcrypt from "bcryptjs";
import { IsEmail, Length } from "class-validator";

@Entity({ name: "users" })
export class User {

    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Length(3, 255)
    @Column()
    public name!: string;

    @IsEmail()
    @Column()
    public email!: string;

    @Length(4, 255)
    @Column()
    public password!: string;

    @CreateDateColumn()
    public readonly created_at!: Date;

    @UpdateDateColumn()
    public readonly updated_at!: Date;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

}