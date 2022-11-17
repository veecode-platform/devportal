import { User } from '../domain/User'

export interface IUsersRepository {
  exists(email: string): Promise<boolean>
  findById(email: string): Promise<User>
  save(user: User): Promise<void>
  create(user: User): Promise<void>
}