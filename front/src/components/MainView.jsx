
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MainView = () => {
    const [likePost, setLikePost] = useState(null);
    const [likePostFlg, setLikePostFlg] = useState(false);

    useEffect(() => {
        // 임시 데이터
        const fetchLikePost = () => {
            const mockPost = {
                id: 1,
                imageInfo: {
                    url: 'https://cataas.com/cat'
                },
                nickname: '냥냥펀치',
                message: '가장 좋아요를 많이 받은 밈이에요!'
            };
            setLikePost(mockPost);
            setLikePostFlg(true);
        };

        fetchLikePost();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center bg-zinc-900">
            <div className="flex flex-col lg:flex-row h-min w-full content-center">
                <div className="flex flex-col lg:flex-row text-white h-min w-full mt-5">
                    <div className="hero min-w-min accent-neutral-900 w-full lg:w-1/2">
                        <div className="hero-content flex-col lg:flex-row-reverse p-8 lg:p-36">
                            <div className="flex-row text-center lg:text-left">
                                <h1 className="text-4xl lg:text-7xl font-bold">Nyangmunity</h1>
                                <p className="py-6 text-sm lg:text-base">당신이 가진 가장 귀여운 고양이 사진을 공유해보세요!</p>
                            </div>
                        </div>
                    </div>
                    <div className="hero min-w-min accent-neutral-900 w-full lg:w-1/2">
                        <div className="hero-content flex-col lg:flex-row-reverse p-8 lg:p-36">
                            <div className="w-full">
                                {likePostFlg && likePost.imageInfo ? (
                                    <div className="text-center">
                                        <img
                                            className="rounded-2xl mx-auto w-full max-w-xs lg:max-w-none"
                                            id="main_img"
                                            src={likePost.imageInfo.url}
                                            alt="main meme"
                                        />
                                        <p className="py-3 text-sm lg:text-base">{likePost.message}</p>
                                    </div>
                                ) : (
                                    <div className="w-full text-center mt-3">
                                        <p className="py-3 text-sm lg:text-base">이미지를 불러오는 중입니다...</p>
                                    </div>
                                )}
                                <div className="text-center mt-1">
                                    <p className="btn btn-outline btn-ghost text-sm lg:text-base">
                                        <Link to="/posts">
                                            메인 페이지의 주인공에 도전해보세요!
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainView;
