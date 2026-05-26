import {
    HiOutlineDesktopComputer,
    HiOutlineHome,
    HiOutlineViewBoards,
    HiOutlineTable,
    HiOutlineUserAdd,
    HiOutlineViewGridAdd,
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    computer: <HiOutlineDesktopComputer />,
    kanban : <HiOutlineViewBoards />,
    list : <HiOutlineTable />,
    userAdd : <HiOutlineUserAdd />,
    ticketAdd : <HiOutlineViewGridAdd />,
}

export default navigationIcon
