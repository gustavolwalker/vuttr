import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Tag } from "./Tag";
import { Min, IsUrl } from "class-validator";

@Entity()
export class Tool {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Min(3)
    @Column()
    public title!: string;

    @IsUrl()
    @Column()
    public link!: string;

    @Column()
    public description!: string;

    @ManyToMany(type => Tag, { cascade: ["insert"], eager: true })
    @JoinTable()
    public tags!: Tag[];

    @CreateDateColumn()
    public readonly created_at!: Date;

    @UpdateDateColumn()
    public readonly updated_at!: Date;
}
