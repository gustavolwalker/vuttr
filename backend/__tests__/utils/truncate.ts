import { getRepository } from "typeorm";

export default (entityClass: any) => {
    getRepository(entityClass).clear();
};