import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";

//create entity for mysql database.
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    surname: string;

    @Column({unique: true})
    username: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column()
    password: string;

    @Column({nullable: true})
    occupation: string;

    @Column({nullable: true})
    city: string;

    @Column({nullable: true, length: 250})
    imageurl: string
    imagefilename: string

}
