// * Libs
import { Dashboard, DashboardCategory, DashboardList, DashboardTitle } from '../libs/dashboard';

// * Types
import type { Reactive } from 'vue';


export const useDashboardsStore = defineStore('dashboards', () => {
    const dashboards = new Map<string, Reactive<Dashboard>>();

    return {
        has(id: string): boolean {
            return dashboards.has(id);
        },
        get(id: string): Reactive<Dashboard> {
            if (dashboards.has(id)) return dashboards.get(id)!;

            const newDashboard = new Dashboard(id);

            const reactiveNewDashboard = reactive(newDashboard);

            dashboards.set(id, reactiveNewDashboard);

            return reactiveNewDashboard;
        },
        remove(id: string): boolean {
            if (!dashboards.has(id)) return true;

            dashboards.delete(id);

            return true;
        },

        getByTypeId(type: 'list' | 'category' | 'title', id: string) {
            let dashboard: Dashboard | null = null;

            dashboards.forEach((d, userId) => {
                const index = d[type === 'list' ? 'lists' : (type === 'title' ? 'titles' : 'categories')].findIndex(t => t._id === id);

                if (index < 0) return;

                // dashboard = d;
            });

            return dashboard;
        },
        getTypeById<Type extends 'list' | 'category' | 'title'>(type: Type, id: string):
            Type extends 'list' ? DashboardList :
            Type extends 'category' ? DashboardCategory :
            Type extends 'title' ? DashboardTitle : never {
            let dataType: any | null = null;

            dashboards.forEach((d, userId) => {
                const data = d[type === 'list' ? 'lists' : (type === 'title' ? 'titles' : 'categories')].find(t => t._id === id);

                if (!data) return;

                dataType = data;
            });

            return dataType;
        }
    }
});