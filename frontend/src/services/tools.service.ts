import api from "./api";

export interface ITool {
    id?: number,
    title: string,
    link: string,
    description: string,
    tags: string[]
}

class ToolsService {

    get(id: number) {
        return api.get<ITool>(`/tools/${id}`);
    }

    getAll(query?: string, onlyTags?: boolean) {
        return api.get<ITool[]>(`/tools${query && query.trim().length ? (onlyTags ? `?tag=${query}`: `?q=${query}`) : '' }`);
    }

    create(tool: ITool) {
        return api.post<ITool>("/tools", tool);
    }

    remove(id: number) {
        return api.delete<ITool[]>(`/tools/${id}`);
    }
}

export { ToolsService };