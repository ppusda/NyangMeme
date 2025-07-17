
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <div className="sticky top-0 h-20 navbar bg-zinc-800 z-10">
                <div className="navbar-start">
                    <Link to="/" className="content-center btn btn-ghost">
                        <span className="text-2xl font-bold text-white">NyangMeme</span>
                    </Link>
                </div>
                <div className="navbar-center">
                </div>
                <div className="navbar-end">
                </div>
            </div>
        </header>
    );
};

export default Header;
