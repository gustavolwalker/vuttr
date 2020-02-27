import bcrypt from "bcryptjs";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent } from "typeorm";
import { User } from "../entity/User";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {

    listenTo() {
        return User;
    }

    async beforeInsert(event: InsertEvent<User>) {
        if (event.entity.password)
            event.entity.password_hash = await bcrypt.hash(event.entity.password, 8);
    }

    async beforeUpdated(event: UpdateEvent<User>) {
        if (event.entity.password)
            event.entity.password_hash = await bcrypt.hash(event.entity.password, 8);
    }
}
