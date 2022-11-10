import bcrypt from 'bcryptjs';

export class ComparePasswordUseCase {
    static execute(password: string, userPassword: string) {
        return bcrypt.compareSync(password, userPassword)
    }
    
}