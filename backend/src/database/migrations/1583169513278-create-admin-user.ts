import { MigrationInterface, getRepository } from "typeorm";
import { User } from "../../app/entities/User";

export class createAdminUser1583169513278 implements MigrationInterface {

    public async up(): Promise<any> {
        let user = new User();
        user.name = "admin";
        user.email = "admin@test.com"
        user.password = "1234";
        user.hashPassword();
        await getRepository(User).save(user);
    }

    public async down(): Promise<any> {
    }

}
