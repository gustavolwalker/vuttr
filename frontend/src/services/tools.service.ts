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

    getAll() {
        return api.get<ITool[]>('/tools');
    }

    create(tool: ITool) {
        return api.post<ITool>("/tools", tool);
    }

    remove(id: number) {
        return api.delete<ITool[]>(`/tools/${id}`);
    }
}

export { ToolsService };