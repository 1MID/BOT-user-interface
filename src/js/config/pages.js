import React from 'react'
import UserProfile from '../components/container/UserContainer/UserProfile'
import MyDeviceManager from '../components/container/UserContainer/MyDeviceManager'
import MyPatientManager from '../components/container/UserContainer/MyPatientManager'
import TransferredLocationManagement from '../components/container/TransferredLocationManagement'
import RolePermissionManagement from '../components/container/RolePermissionManagement'
import LBeaconTable from '../components/container/LBeaconTable'
import GatewayTable from '../components/container/GatewayTable'
import AdminManagementContainer from '../components/container/UserContainer/AdminManagementContainer'
import MonitorSettingBlock from '../components/container/MonitorSettingBlock'
import GeoFenceSettingBlock from '../components/container/GeoFenceSettingBlock'
import TrackingTable from '../components/container/TrackingTable'
import TrackingHistory from '../components/container/TrackingHistory'
import ObjectEditedRecord from '../components/container/UserContainer/ObjectEditedRecord'
import ShiftChangeRecord from '../components/container/UserContainer/ShiftChangeRecord'
import config from '../config'

export const navbarList = [
    {
        name: "home",
        alias: "home",
        path: "/",
    },
    {
        name: "shift change",
        alias: "shiftChange",
        path: "/",
        permission: "user:shiftChange",
        platform: ['browser', 'tablet'],
    },
    {
        name: "object management",
        alias: "objectManagement",
        path: "/page/objectManagement",
        permission: "route:objectManagement"
    },
    {
        name: "tracking history",
        alias: "trackinghistory",
        path: "/page/trackingHistory",
        permission: "route:trackingHistory"

    },
    {
        name: "big screen",
        alias: "bigScreen",
        path: "/page/bigScreen",
        permission: "route:bigScreen",
        platform: ['browser']
    },
    {
        name: "monitor setting",
        alias: "monitor",
        path: "/page/monitor",
        permission: "route:monitor",
        platform: ['browser']
    },
    {
        name: "report",
        alias: "report",
        path: "/page/report",
        permission: "route:report",
        platform: ['browser', 'tablet']
    },

    {
        name: "system setting",
        alias: "systemSetting",
        path: "/page/systemSetting",
        permission: "route:systemSetting"
    },

]

export const userContainerPageList = [
    {
        name: 'User Profile',
        path: 'userProfile',
        href: '#UserProfile',
        component: <UserProfile />
    },
    {
        name: 'Devices Management',
        path: 'devicesManagement',
        href: '#DevicesManagement',
        component: <MyDeviceManager />
    },
    {
        name: 'Patient Management',
        path: 'patientManagement',
        href: '#PatientManagement',
        component: <MyPatientManager />
    },
]

export const systemSettingPageList = [
    {
        name: 'user manager',
        permission: "route:bigScreen",
        component: (props) => <AdminManagementContainer {...props}/>,
        platform: ['browser'],
    },
    {
        name: "transferred location management",
        component: (props) => <TransferredLocationManagement {...props}/>,
    },
    {
        name: "Role Permission Management",
        permission: "rolePermissionManagement",
        component: (props) => <RolePermissionManagement {...props}/>,
        platform: ['browser', 'tablet']
    },
    {
        name: "lbeacon",
        component: (props) => <LBeaconTable {...props}/>,
        platform: ['browser', 'tablet']
    },
    {
        name: "gateway",
        component: (props) => <GatewayTable {...props}/>,
        platform: ['browser', 'tablet']
    }
]

export const monitorSettingPageList = [
    {
        name: config.monitorSettingType.MOVEMENT_MONITOR,
        component: (props) => <MonitorSettingBlock {...props}/>
    },
    {
        name: config.monitorSettingType.LONG_STAY_IN_DANGER_MONITOR,
        component: (props) => <MonitorSettingBlock {...props}/>
    },
    {
        name: config.monitorSettingType.NOT_STAY_ROOM_MONITOR,
        component: (props) => <MonitorSettingBlock {...props}/>
    },
    {
        name: config.monitorSettingType.GEOFENCE_MONITOR,
        component: (props) => <GeoFenceSettingBlock {...props}/>
    },
]

export const trackingHistoryContainerPageList = [
    {
        name: 'real time tracking record',
        permission: "route:trackingHistory",
        component: (props) => <TrackingTable {...props}/>,
        platform: ['browser'],
    },
    {
        name: 'historical tracking record',
        permission: "route:trackingHistory",
        component: (props) => <TrackingHistory {...props}/>,
        platform: ['browser'],
    },
]

export const reportContainerPageList = [
    {
        name: 'object edited record',
        component: (props) => <ObjectEditedRecord {...props} />
    },
    {
        name: 'Shift Change Record',
        component: (props) => <ShiftChangeRecord {...props}/>,
    },
]