import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Developer extends BaseEntity {
  @ObjectIdColumn()
  _id: string;

  @Column()
  userId: string;

  @Column()
  firstName: string;

  @Column()
  familyName: string;

  @Column('date', { default: new Date() })
  createdAt: Date;

  @Column('date', { default: new Date() })
  updatedAt: Date;
}
