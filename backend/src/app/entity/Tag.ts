import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Tag {

    @PrimaryColumn()
    public tag!: string;

}
