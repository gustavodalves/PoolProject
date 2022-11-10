import bcrypt from 'bcryptjs';

export class EncryptPasswordUseCase {
    static execute(password: string) {
        const hashedPassword = bcrypt.hashSync(password, 5)
        return hashedPassword
    }
}
