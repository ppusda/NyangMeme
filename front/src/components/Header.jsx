
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [nickname, setNickname] = useState('');

    // 임시로 로그인 상태와 닉네임을 설정합니다.
    useEffect(() => {
        // 실제 애플리케이션에서는 Redux, Context API 등을 사용하여 로그인 상태를 관리합니다.
        setIsLogin(true);
        setNickname('냥냥펀치');
    }, []);

    const handleLogout = () => {
        // 로그아웃 로직을 구현합니다.
        setIsLogin(false);
        setNickname('');
    };

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
                    {isLogin ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex="0" role="button" className="btn btn-ghost rounded-btn"> {nickname}님, 환영합니다!</div>
                            <ul tabIndex="0" className="menu menu-md dropdown-content mt-5 z-[1] p-3 shadow rounded-box w-52 bg-zinc-800">
                                <li>
                                    <Link to="/info"><i className="fa-solid fa-address-card" />마이페이지</Link>
                                </li>
                                <li><a onClick={handleLogout}><i className="fa-solid fa-door-closed" />로그아웃</a></li>
                            </ul>
                        </div>
                    ) : (
                        <div>
                            <Link to="/login" className="btn btn-ghost text-sm">
                                <i className="fa-solid fa-door-open" />로그인
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
