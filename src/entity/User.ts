import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Profile } from "./Profile";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: "text", unique: true })
  email: string;

  @Column({ type: "varchar", length: "230" })
  firstName: string;

  @Column({ type: "varchar", length: "230" })
  lastName: string;

  @Column({ type: "boolean", default: false })
  confirmed: boolean;

  @Column() age: number;

  @Column({ nullable: true })
  profileId: number;

  @OneToOne(type => Profile)
  @JoinColumn()
  profile: Profile;
}
