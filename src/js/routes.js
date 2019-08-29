import MainContainer from "./components/container/MainContainer";
import SystemStatus from "./components/container/SystemStatus";
import Geofence from "./components/container/Geofence";
import ObjectManagementContainer from "./components/container/ObjectManagementContainer";
import UserSettingContainer from "./components/container/UserContainer/UserSettingContainer";

const routes = [
    {
        path: '/',
        component: MainContainer,
        exact: true,
    },
    {
        path: '/page/systemStatus',
        component: SystemStatus,
        exact: true,
    },
    {
        path: '/page/geofence',
        component: Geofence,
        exact: true,
    },
    {
        path: '/page/objectManagement',
        component: ObjectManagementContainer,
        exact: true,
    },
    {
        path: '/page/userSetting',
        component: UserSettingContainer,
        exact: true,
    },
];

export default routes;