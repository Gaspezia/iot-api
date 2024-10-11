import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
    //private emailService: EmailService
  ) {}
  createQueryBuilder(alias: string) {
    return this.userRepository.createQueryBuilder(alias);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);

    const savedUser = await this.userRepository.save(user);

    // await this.emailService.sendEmail(savedUser.email, 'Identifiant de connexion', 'registration', {
    //   email: savedUser.email,
    //   password: createUserDto.password
    // });

    return savedUser;
  }

  async update(id: number, updateUserDto: CreateUserDto): Promise<User> {
    const plainPassword = updateUserDto.password;
    const shouldSendPasswordUpdateEmail = !!plainPassword;

    await this.userRepository.update(id, updateUserDto);

    // if (shouldSendPasswordUpdateEmail) {
    //   const user = await this.userRepository.findOneBy({ id });
    //   await this.emailService.sendEmail(user.email, 'Modification de mot de passe', 'update-password', {
    //     email: user.email,
    //     password: plainPassword
    //   });
    // }

    return this.userRepository.findOneBy({ id });
  }

  async updateLastLogin(userId: number): Promise<UpdateResult> {
    return this.userRepository.update(userId, { last_login: new Date() });
  }
}
