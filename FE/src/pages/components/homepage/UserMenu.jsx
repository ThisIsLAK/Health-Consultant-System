import { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
    ArchiveBoxXMarkIcon,
    ChevronDownIcon,
    PencilIcon,
    Square2StackIcon,
    TrashIcon,
} from '@heroicons/react/16/solid'
import { useNavigate } from "react-router-dom";
import ApiService from "../../../service/ApiService";

const UserMenu = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: "", avatar: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        const fetchUserInfo = async () => {
            const response = await ApiService.getLoggedInUserInfo();
            if (response.status === 200) {
                setUserInfo({
                    name: response.data.name || "User",
                    avatar: response.data.avatar || "https://i.pravatar.cc/40",
                });
                setIsLoggedIn(true);
            } else {
                handleSignOut();
            }
        };

        fetchUserInfo();
    }, []);

    const handleSignOut = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate("/login");
    };

    if (!isLoggedIn) {
        return (
            <>
                <button className="btn-signin" onClick={() => navigate("/login")}>Sign In</button>
                <button className="btn-get-started" onClick={() => navigate("/support")}>Get Started</button>
            </>
        );
    }

    return (
        <Menu>
            <MenuButton>My account</MenuButton>
            <MenuItems anchor="bottom" className={"qqabsolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg"}>
                <MenuItem className="">
                    <a className="block data-[focus]:bg-blue-100" href="/settings">
                        Settings
                    </a>
                </MenuItem>
                <MenuItem>
                    <a className="block data-[focus]:bg-blue-100" href="/support">
                        Support
                    </a>
                </MenuItem>
                <MenuItem>
                    <a className="block data-[focus]:bg-blue-100" href="/license">
                        License
                    </a>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
};

export default UserMenu;
