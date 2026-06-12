import {
    HiOutlineDesktopComputer,
    HiOutlineHome,
    HiOutlineViewBoards,
    HiOutlineTable,
    HiOutlineUserAdd,
    HiOutlineViewGridAdd,
    HiOutlineTag,
    HiOutlinePencil,
    HiOutlineThumbUp,
} from 'react-icons/hi'

import { HiMiniCog8Tooth } from "react-icons/hi2";

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    computer: <HiOutlineDesktopComputer />,
    kanban : <HiOutlineViewBoards />,
    list : <HiOutlineTable />,
    userAdd : <HiOutlineUserAdd />,
    ticketAdd : <HiOutlineViewGridAdd />,
    cog: <HiMiniCog8Tooth />,
    nametag: <HiOutlineTag />,
    category: <HiOutlinePencil />,
    status: <HiOutlineThumbUp />,
}

export default navigationIcon
